using FingerprintApi.Services;
using Microsoft.AspNetCore.Mvc;
using libzkfpcsharp;

namespace FingerprintApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FingerprintController : ControllerBase
    {
        private readonly FingerprintService _fingerprintService;

        public FingerprintController(FingerprintService fingerprintService)
        {
            _fingerprintService = fingerprintService;
        }

        [HttpPost("init")]
        public IActionResult InitializeDevice()
        {
            var result = _fingerprintService.InitDevice();
            if (result > 0)
            {
                return Ok($"Initialized, {result} device(s) found.");
            }
            else if (result == zkfp.ZKFP_ERR_NO_DEVICE)
            {
                return BadRequest("No device connected.");
            }
            else if (result == zkfp.ZKFP_ERR_ALREADY_INIT)
            {
                return BadRequest("Device already initialized.");
            }
            else
            {
                return BadRequest($"Initialization failed with error code: {result}");
            }
        }

        [HttpPost("open")]
        public IActionResult OpenDevice([FromQuery] int index)
        {
            if (index < 0)
            {
                return BadRequest("Invalid device index.");
            }

            if (_fingerprintService.OpenDevice(index))
            {
                return Ok("Device opened successfully.");
            }
            return BadRequest("Failed to open device. Please check if the device is connected and try again.");
        }

        [HttpPost("enroll/start")]
        public IActionResult StartEnrollment()
        {
            var result = _fingerprintService.StartEnrollment();
            if (result)
            {
                return Ok("Enrollment started.");
            }
            return BadRequest("Failed to start enrollment. Enrollment may have already started.");
        }

        [HttpPost("enroll/complete")]
        public IActionResult CompleteEnrollment()
        {
            var result = _fingerprintService.CompleteEnrollment();
            if (result.Success)
            {
                return Ok(new { Message = result.Message, Id = result.Id });
            }
            else
            {
                return BadRequest(result.Message);
            }
        }

        [HttpPost("cancel")]
        public IActionResult CancelEnrollment()
        {
            var result = _fingerprintService.CancelEnrollment();
            return Ok(result);
        }

        [HttpPost("capture")]
        public IActionResult CaptureFingerprint()
        {
            var result = _fingerprintService.CaptureFingerprint();
            if (result == "Fingerprint captured.")
            {
                var imageBase64 = _fingerprintService.GetFingerprintImageBase64();
                return Ok(new { message = result, image = imageBase64 });
            }
            return BadRequest(result);
        }

        [HttpPost("identify")]
        public IActionResult IdentifyFingerprint()
        {
            var result = _fingerprintService.IdentifyFingerprint();
            if (result.Success)
            {
                // Return the result with ID and score
                return Ok(new 
                {
                    message = result.Message,
                    id = result.Id,
                    score = result.Score
                });
            }
            return BadRequest(new 
            {
                message = result.Message
            });
        }

          [HttpPost("close")]
        public IActionResult CloseDevice()
        {
            try
            {
                _fingerprintService.CloseDevice();
                return Ok("Device closed successfully.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while closing the device: {ex.Message}");
            }
        }


    }
}
