using NUnit.Framework;

namespace mobile_social_linker.Common.Tests
{
    public class TrackingTests
    {

        [Test]
        [TestCase("https://docs.microsoft.com/en-us/mydoc", ExpectedResult = "https://docs.microsoft.com/mydoc?WT.mc_id=event-channel-alias")]
        [TestCase("https://docs.microsoft.com/fr-ca/mydoc", ExpectedResult = "https://docs.microsoft.com/mydoc?WT.mc_id=event-channel-alias")]
        [TestCase("https://docs.microsoft.com/en-us/mydoc?anotherParam=test", ExpectedResult = "https://docs.microsoft.com/mydoc?anotherParam=test&WT.mc_id=event-channel-alias")]
        [TestCase("https://docs.microsoft.com/en-us/mydoc#anchor1", ExpectedResult = "https://docs.microsoft.com/mydoc?WT.mc_id=event-channel-alias#anchor1")]
        [TestCase("https://docs.microsoft.com/en-us/mydoc?anotherParam=test#anchor1", ExpectedResult = "https://docs.microsoft.com/mydoc?anotherParam=test&WT.mc_id=event-channel-alias#anchor1")]
        [TestCase("https://docs.microsoft.com/en-us/mydoc?WT.mc_id=foobar", ExpectedResult = "https://docs.microsoft.com/mydoc?WT.mc_id=event-channel-alias")]
        [TestCase("https://docs.microsoft.com/en-us/mydoc?wt.mc_id=foobar", ExpectedResult = "https://docs.microsoft.com/mydoc?WT.mc_id=event-channel-alias")]
        [TestCase("https://docs.microsoft.com/en-us/mydoc?WT.MC_ID=foobar", ExpectedResult = "https://docs.microsoft.com/mydoc?WT.mc_id=event-channel-alias")]
        [TestCase("https://docs.microsoft.com/en-us/azure/azure-functions/functions-diagnostics", ExpectedResult = "https://docs.microsoft.com/azure/azure-functions/functions-diagnostics?WT.mc_id=event-channel-alias")]
        public string EnsureUrlsAreFullyTrackedByRemovingLocaleAndAddingTrackingCode(string url)
        {
            // arrange

            // act 
            var trackedUrl = Tracking.AppendTrackingInfo(url, "event", "channel", "alias");

            // assert
            return trackedUrl;
        }
    }
}