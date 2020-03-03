
using Android.App;
using Android.Content;
using Android.OS;
using mobile_social_linker.Common;
using Xamarin.Essentials;

namespace mobile_social_linker.Droid
{
    [Activity(Label = "TwitterShare", Icon = "@mipmap/icon", Theme = "@android:style/Theme.NoDisplay")]
    [IntentFilter(new[] { Intent.ActionSend }, Categories = new[] { Intent.CategoryDefault }, DataMimeType = @"text/plain", Label = "Twitter")]
    public class TwitterShare : Activity
    {
        protected override async void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            Xamarin.Essentials.Platform.Init(this, savedInstanceState);

            if (Intent.Action == Intent.ActionSend)
            {

                // This is just an example of the data stored in the extras 
                var uriFromExtras = Intent.GetStringExtra(Intent.ExtraText).Trim();
                var alias = await SecureStorage.GetAsync("Alias");

                // Check for existing query string and use & instead
                var uri = Tracking.AppendTrackingInfo(uriFromExtras, "social", "twitter", alias);

                await Clipboard.SetTextAsync(uri);

                await Launcher.TryOpenAsync($"twitter://post?text={uri}");
            }
            Finish();
        }
    }

    
}