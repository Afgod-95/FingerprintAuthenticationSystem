using System;
using System.Collections.Generic;
using System.IO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using libzkfpcsharp;

namespace FingerprintApi.Services
{
    public class FingerprintService
    {
        private IntPtr mDevHandle = IntPtr.Zero;
        private IntPtr mDBHandle = IntPtr.Zero;
        private byte[] FPBuffer = Array.Empty<byte>();
        private byte[] CapTmp = new byte[107424]; // Adjusted size to match expected data
        private int cbCapTmp = 107424;
        private bool IsRegister = false;
        private int iFid;
        private int mfpWidth = 0;
        private int mfpHeight = 0;

        private readonly string fidFilePath = "fid.txt"; // File to store the fingerprint ID
        private readonly string fingerprintStoragePath = "fingerprints.bin"; // Path to store fingerprint data

        public FingerprintService()
        {
            // Load the saved fid from a file
            iFid = LoadFidFromFile();
        }

        public int InitDevice()
        {
            // Initialize fingerprint device and return the device count
            try
            {
                Console.WriteLine("Initializing the fingerprint device...");

                int ret = zkfp2.Init();
                Console.WriteLine($"Initialization result code: {ret}");

                if (ret != zkfp.ZKFP_ERR_OK)
                {
                    Console.WriteLine($"Initialization failed with error code: {ret}");
                    throw new InvalidOperationException($"Failed to initialize fingerprint device. Error code: {ret}");
                }

                int deviceCount = zkfp2.GetDeviceCount();
                if (deviceCount == 0)
                {
                    throw new InvalidOperationException("No fingerprint device connected.");
                }

                Console.WriteLine("Fingerprint device initialized successfully.");
                return deviceCount;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception during device initialization: {ex.Message}");
                throw;
            }
        }

        public void FreeResources()
        {
            if (mDevHandle != IntPtr.Zero)
            {
                zkfp2.CloseDevice(mDevHandle);
                mDevHandle = IntPtr.Zero;
                Console.WriteLine("Device handle freed.");
            }

            if (mDBHandle != IntPtr.Zero)
            {
                zkfp2.DBFree(mDBHandle);
                mDBHandle = IntPtr.Zero;
                Console.WriteLine("Database handle freed.");
            }
        }

        public bool OpenDevice(int index)
        {
            // Free existing resources before opening a new device
            FreeResources();

            // Open the device
            mDevHandle = zkfp2.OpenDevice(index);
            if (mDevHandle == IntPtr.Zero)
            {
                throw new InvalidOperationException("Failed to open the fingerprint device.");
            }

            // Initialize the fingerprint database if it hasn't been initialized yet
            if (mDBHandle == IntPtr.Zero)
            {
                mDBHandle = zkfp2.DBInit();
                if (mDBHandle == IntPtr.Zero)
                {
                    throw new InvalidOperationException("Failed to initialize fingerprint database.");
                }
            }

            byte[] paramValue = new byte[4];
            int size = 4;

            // Retrieve fingerprint width
            if (zkfp2.GetParameters(mDevHandle, 1, paramValue, ref size) != zkfp.ZKFP_ERR_OK)
            {
                throw new InvalidOperationException("Failed to retrieve fingerprint width.");
            }
            zkfp2.ByteArray2Int(paramValue, ref mfpWidth);

            // Retrieve fingerprint height
            size = 4;
            if (zkfp2.GetParameters(mDevHandle, 2, paramValue, ref size) != zkfp.ZKFP_ERR_OK)
            {
                throw new InvalidOperationException("Failed to retrieve fingerprint height.");
            }
            zkfp2.ByteArray2Int(paramValue, ref mfpHeight);

            Console.WriteLine($"Fingerprint width: {mfpWidth}, height: {mfpHeight}");

            FPBuffer = new byte[mfpWidth * mfpHeight];

            // Re-add previously saved fingerprints to the database
            var savedFingerprints = LoadFingerprintsFromStorage(); // Load saved fingerprints
            foreach (var savedFingerprint in savedFingerprints)
            {
                int ret = zkfp2.DBAdd(mDBHandle, savedFingerprint.Id, savedFingerprint.Template);
                if (ret != zkfp.ZKFP_ERR_OK)
                {
                    Console.WriteLine($"Error adding fingerprint ID {savedFingerprint.Id}: {ret}");
                }
                else
                {
                    Console.WriteLine($"Successfully added fingerprint ID {savedFingerprint.Id}");
                }
            }

            return true;
        }

        public bool StartEnrollment()
        {
            if (!IsRegister)
            {
                IsRegister = true;
                return true;
            }
            return false;
        }

        public (bool Success, string Message, int? Id) CompleteEnrollment()
        {
            if (!IsRegister) return (false, "Enrollment not started.", null);

            cbCapTmp = CapTmp.Length;
            int ret = zkfp2.AcquireFingerprint(mDevHandle, FPBuffer, CapTmp, ref cbCapTmp);
            if (ret != zkfp.ZKFP_ERR_OK)
            {
                return (false, "Capture failed.", null);
            }

            ret = zkfp2.DBAdd(mDBHandle, iFid, CapTmp);
            if (ret == zkfp.ZKFP_ERR_OK)
            {
                IsRegister = false;
                SaveFidToFile(iFid + 1); // Save updated fid to file
                SaveFingerprintToStorage(iFid, CapTmp); // Save the fingerprint data
                return (true, "Enrollment successful!", iFid++);
            }
            return (false, "Enrollment failed with error code: " + ret, null);
        }

        public string CancelEnrollment()
        {
            if (!IsRegister) return "No enrollment in progress.";

            IsRegister = false;
            return "Enrollment canceled.";
        }

        
        private int LoadFidFromFile()
        {
            if (File.Exists(fidFilePath))
            {
                string fidString = File.ReadAllText(fidFilePath);
                if (int.TryParse(fidString, out int savedFid))
                {
                    return savedFid;
                }
            }
            return 1; // Return 1 if no fid is found in the file
        }

        private void SaveFidToFile(int fid)
        {
            File.WriteAllText(fidFilePath, fid.ToString());
        }

        // Load stored fingerprints from file
        private List<(int Id, byte[] Template)> LoadFingerprintsFromStorage()
        {
            var fingerprints = new List<(int Id, byte[] Template)>();

            if (File.Exists(fingerprintStoragePath))
            {
                using (var fs = new FileStream(fingerprintStoragePath, FileMode.Open, FileAccess.Read))
                using (var br = new BinaryReader(fs))
                {
                    while (br.BaseStream.Position != br.BaseStream.Length)
                    {
                        int id = br.ReadInt32();
                        int templateLength = br.ReadInt32();
                        byte[] template = br.ReadBytes(templateLength);
                        fingerprints.Add((id, template));
                    }
                }
            }

            return fingerprints;
        }


        // Save fingerprint to storage
        private void SaveFingerprintToStorage(int id, byte[] template)
        {
            using (var fs = new FileStream(fingerprintStoragePath, FileMode.Append, FileAccess.Write))
            using (var bw = new BinaryWriter(fs))
            {
                bw.Write(id);
                bw.Write(template.Length);
                bw.Write(template);
            }
        }

        public string CaptureFingerprint()
        {
            cbCapTmp = CapTmp.Length; // Ensure CapTmp has enough size
            int ret = zkfp2.AcquireFingerprint(mDevHandle, FPBuffer, CapTmp, ref cbCapTmp);
            if (ret == zkfp.ZKFP_ERR_OK)
            {
                return "Fingerprint captured.";
            }
            return "Capture failed.";
        }

        public (bool Success, string Message, int? Id, int? Score) IdentifyFingerprint()
        {
            if (mDevHandle == IntPtr.Zero)
            {
                Console.WriteLine("Device handle is zero. Ensure the fingerprint device is connected and initialized.");
                return (false, "Fingerprint device is not connected.", null, null);
            }

            const int maxRetries = 3;
            int retryCount = 0;
            bool success = false;
            while (retryCount < maxRetries && !success)
            {
                cbCapTmp = CapTmp.Length;
                int captureResult = zkfp2.AcquireFingerprint(mDevHandle, FPBuffer, CapTmp, ref cbCapTmp);

                if (captureResult == zkfp.ZKFP_ERR_OK)
                {
                    success = true;
                }
                else
                {
                    Console.WriteLine($"Capture failed with error code: {captureResult}. Retrying...");
                    retryCount++;
                    System.Threading.Thread.Sleep(500); // Wait before retrying
                }
            }

            if (!success)
            {
                return (false, "Failed to capture fingerprint after multiple attempts.", null, null);
            }

            Console.WriteLine($"Captured fingerprint data: {BitConverter.ToString(CapTmp)}"); // Log fingerprint data

            int fid = 0, score = 0;
            int identifyResult = zkfp2.DBIdentify(mDBHandle, CapTmp, ref fid, ref score);

            if (identifyResult == zkfp.ZKFP_ERR_OK)
            {
                Console.WriteLine($"Fingerprint identified successfully. ID: {fid}, Score: {score}");
                return (true, $"Fingerprint identified, ID: {fid}, Score: {score}", fid, score);
            }

            Console.WriteLine($"Identification failed with error code: {identifyResult}");
            return (false, $"Fingerprint not recognized. Error code: {identifyResult}", null, null);
        }





        public string GetFingerprintImageBase64()
        {
            try
            {
                if (CapTmp.Length != mfpWidth * mfpHeight)
                {
                    return $"Error generating image: Invalid data length. Expected {mfpWidth * mfpHeight}, but got {CapTmp.Length}.";
                }

                using (var image = ConvertFingerprintDataToImage(CapTmp))
                using (var ms = new MemoryStream())
                {
                    image.SaveAsPng(ms);
                    var imageBytes = ms.ToArray();
                    return Convert.ToBase64String(imageBytes);
                }
            }
            catch (Exception ex)
            {
                return $"Error generating image: {ex.Message}";
            }
        }

        private Image<L8> ConvertFingerprintDataToImage(byte[] fingerprintData)
        {
            // Convert fingerprint data into an Image using ImageSharp
            return Image.LoadPixelData<L8>(fingerprintData, mfpWidth, mfpHeight);
        }

        public void CloseDevice()
        {
            if (mDevHandle != IntPtr.Zero)
            {
                zkfp2.CloseDevice(mDevHandle);
                mDevHandle = IntPtr.Zero;
                Console.WriteLine("Device closed successfully.");
            }
            else
            {
                throw new InvalidOperationException("No device is currently connected.");
            }

            if (mDBHandle != IntPtr.Zero)
            {
                zkfp2.DBFree(mDBHandle);
                mDBHandle = IntPtr.Zero;
                Console.WriteLine("Fingerprint database closed successfully.");
            }
        }


    }
}
