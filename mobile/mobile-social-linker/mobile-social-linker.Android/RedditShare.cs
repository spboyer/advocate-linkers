
using Android.App;
using Android.Content;
using Android.OS;
using mobile_social_linker.Common;
using Xamarin.Essentials;

namespace mobile_social_linker.Droid
{
    [Activity(Label = "RedditShare", Icon = "@mipmap/icon", Theme = "@android:style/Theme.NoDisplay")]
    [IntentFilter(new[] { Intent.ActionSend }, Categories = new[] { Intent.CategoryDefault }, DataMimeType = @"text/html", Label = "Reddit")]
    public class RedditShare : Activity
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
                var uri = Tracking.AppendTrackingInfo(uriFromExtras, "social", "reddit", alias);

                await Clipboard.SetTextAsync(uri);

                await Launcher.TryOpenAsync($"https://reddit.com/submit?url={uri}");
            }
            Finish();
        }
    }

    
}