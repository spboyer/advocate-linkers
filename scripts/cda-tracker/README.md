# CDA Link Tracker

*Original source from [anthonychu/cda-tracker](https://github.com/anthonychu/cda-tracker)*

Appends `WT.mc_id=` referral query string to all links that have the following domains:

* *.microsoft.com
* *.msdn.com
* *.visualstudio.com
* www.microsoftevents.com

## Usage

Place this code at the end of the `</body>` on any web page:

```html
<script src="//cdn.jsdelivr.net/gh/anthonychu/cda-tracker@0.3/src/cda-tracker.js"></script>
<script>
cdaTracker({
    domains: [], // additional domains (string or regex)
    event: "ignite",
    channel: "twitter",
    alias: 'antchu'
});
</script>
```

## Limitations

Only works for `<a>` tags in DOM on page load (single page app support coming soon).