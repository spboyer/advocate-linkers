using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.WebUtilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace mobile_social_linker.Common
{
    public static class Tracking
    {
        private static Regex[] DefaultDomainsRegex = new[] {
            new Regex("(.*\\.)?microsoft\\.com$", RegexOptions.IgnoreCase),
            new Regex("(.*\\.)?msdn\\.com$", RegexOptions.IgnoreCase),
            new Regex("(.*\\.)?visualstudio\\.com$", RegexOptions.IgnoreCase)
        };

        public static string AppendTrackingInfo(string link, string eventName, string channel, string alias)
        {
            var makeLink = false;
            foreach(var r in DefaultDomainsRegex)
            {
                if (r.IsMatch(link))
                {
                    makeLink = true;
                }
            }

            if (makeLink == false)
            {
                return link;
            }
            
            UriBuilder builder = new UriBuilder(link);

            builder = builder.AddTrackingCode(eventName, channel, alias);
            builder = builder.RemoveLocale();
            
            return builder.Uri.ToString();
        }

        private static UriBuilder RemoveLocale(this UriBuilder builder)
        {
            Regex localeMatcher = new Regex("^/\\w{2}-\\w{2}");
            builder.Path = localeMatcher.Replace(builder.Path, string.Empty);
            return builder;
        }

        private static UriBuilder AddTrackingCode(this UriBuilder builder, string eventName, string channel, string alias)
        {
            const string trackingName = "WT.mc_id";
            string trackingCode = $"{eventName}-{channel}-{alias}";
            
            //var qs = QueryString.FromUriComponent(builder.Query);
            var qs = QueryHelpers.ParseQuery(builder.Query);
            qs.Remove(trackingName);
            qs.Add(trackingName, trackingCode);
            QueryBuilder queryBuilder = new QueryBuilder(qs.SelectMany(x=> x.Value, (c,v) => new KeyValuePair<string,string>(c.Key, v) ).ToList());
            builder.Query = queryBuilder.ToQueryString().ToString();

            return builder;
        }
    }
}
