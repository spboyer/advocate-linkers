# CxA Linkify

A Chrome Extension that allows for the simple creation and shortening of links that conform to the Web Trends standard

## Installing

1. Clone this repo

2. In Google Chrome, navigate to `chrome://extensions` and turn on the "Developer Mode" toggle.

3. Select "Load Unpacked"

4. Select the folder that you cloned to

## Use

On any page that you want to link to with tracking, open the extension.

Fill in the event, channel and alias. These values are remembered and persisted in the extension.

Clicking the "Track" button will format the current page URL for Web Trends tracking and copy it to the clipboard. The extension then closes.

Clickin the "Shorten" button will first format the current Page URL for Web Trends tracking. It then sends that URL to the cda.ms shortener service which returns a shortened URL. This URL is copied to the clipboard and the extension closes.
