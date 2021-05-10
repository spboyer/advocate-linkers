# advocate-linkers

## Browser Extension
Get the [WT'ify browser extension](https://chrome.google.com/webstore/detail/wtify/hemgoconacbmdiefpokgaodmmgidfopc) from the Chrome Web Store. 

### Edge 
The extension is available through the link above also for Edge. You must allow extensions from other stores first in the [extension manager](edge://extensions).

### InPrivate / Incognito
After installing WT'ify, go to the extension details and allow in InPrivate (Edge) / incognito (Chrome).

### Usage
When on a page you want to link to, instead of copying the URL from the address bar, click on the WT icon.
 
![image](https://user-images.githubusercontent.com/4953875/117641805-e0c9fd00-b186-11eb-88b8-4bbc861f2e27.png)

The URL is taken from the address bar. You can change it here. 
Enter your details and Advocacy DevOps Item (ADO) ID. 

*New Feature:* If you want to keep the locale code in the URL switch on ‘Keep Locale’.

The settings are kept in the browser’s storage so that you don’t need to re-enter the details for every link!

## Web Application

[![Build Status](https://dev.azure.com/shayneboyer/social-linker/_apis/build/status/spboyer.advocate-linkers?branchName=master)](https://dev.azure.com/shayneboyer/social-linker/_build/latest?definitionId=12&branchName=master&WT.mc_id=advocatelinkers-github-shboyer)

[aka.ms/cdalinker](https://aka.ms/cdalinker) - Simple VueJS application to add `/?WT.mc_id=tactic-category-alias` path to Microsoft based links. This is used by the Cloud Advocates to help track Microsoft-based traffic.

## CLI tools

[aka.ms/cxatrack](https://aka.ms/cxatrack) - Convenient CLI to quickly update CxA tracked links. Supports batch mode with auto search & replace, frontmatter and clipboard watch.

- Install: `npm install -g cxa-track`
- Usage: `cxa --help`
