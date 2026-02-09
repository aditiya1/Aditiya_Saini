using TaskManager.Blazor.Components;
using TaskManager.Blazor.Services;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

var apiBaseUrl = builder.Configuration["ApiBaseUrl"];
if (string.IsNullOrEmpty(apiBaseUrl))
{
    var hostport = builder.Configuration["ApiHostPort"];
    var apiHost = builder.Configuration["ApiHost"];
    var apiPort = builder.Configuration["ApiPort"];
    if (!string.IsNullOrEmpty(hostport))
        apiBaseUrl = hostport.StartsWith("http") ? hostport : $"http://{hostport}";
    else if (!string.IsNullOrEmpty(apiHost) && !string.IsNullOrEmpty(apiPort))
        apiBaseUrl = $"http://{apiHost}:{apiPort}";
    else if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("PORT")))
        apiBaseUrl = "https://task-manager-api.onrender.com";
    else
        apiBaseUrl = "http://localhost:5000";
}
builder.Services.AddHttpClient<TaskApiService>(client =>
{
    client.BaseAddress = new Uri(apiBaseUrl);
});

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}
app.UseStatusCodePages();
if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("PORT")))
{
    app.UseHttpsRedirection();
}

app.UseAntiforgery();
app.UseStaticFiles();

app.MapGet("/health", () => Results.Ok());
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
