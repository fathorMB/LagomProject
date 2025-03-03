using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using Lagom.WebAPI.Hubs;
using Lagom.Common;
using Microsoft.Extensions.Options;
using Lagom.WebAPI.Contracts.HubMessages;

namespace Lagom.WebAPI.Services
{
    public class SignalRProbeService : BackgroundService
    {
        private readonly IHubContext<ProbeHub> _hubContext;
        private readonly ILogger<SignalRProbeService> _logger;
        private readonly AppSettings _appSettings;

        // Pre-defined time interval in minutes and the message to send
        private readonly int _intervalMinutes = 0; // Change as needed

        public SignalRProbeService(IHubContext<ProbeHub> hubContext, ILogger<SignalRProbeService> logger, IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
            _intervalMinutes = _appSettings.WebSocketProbeInterval;
            _hubContext = hubContext;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("SignalRProbeService started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                // Wait for the defined interval
                await Task.Delay(TimeSpan.FromMinutes(_intervalMinutes), stoppingToken);

                var probeMessage = new ProbeMessage()
                {
                    APIVersion = _appSettings.WebSocketProbeAPIVersion,
                    ServerDateTime = DateTime.Now //TO change with LagomDateTimeProvider.Now call
                };

                // Send the message to all connected clients using the "ReceiveMessage" method
                await _hubContext.Clients.All.SendAsync("ReceiveProbeSignal", probeMessage, cancellationToken: stoppingToken);
                _logger.LogInformation("Sent scheduled probe message: {Message}", probeMessage);
            }

            _logger.LogInformation("SignalRMessageService is stopping.");
        }
    }
}
