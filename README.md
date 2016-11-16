# Music Server

This is a webserver where everybody can **enqueue** songs from various online sources and create a playlist **together**.

It has a nice user interface and is easy to use.

It can be used on parties or just in any room where people gather, a roomshare house, an office, a student's room at the university. Everywhere, where people can listen to music together.

It's built with the well known [Meteor App Framework](https://www.meteor.com).

![Music Server Screenshot](http://files.janholub.de/musicserver_screen.png)

## Features

   * Create a playlist together
      * Add / delete songs
      * Skip songs
      * Play / Pause
      * Volume
   * Desktop and Mobile UI
      * Simple and clean
      * Colours adjust to the thumbnail images
   * Plays music from any streaming source that [youtube-dl](http://rg3.github.io/youtube-dl/supportedsites.html) can handle, such as
      * YouTube
      * SoundCloud
      * Vimeo
      * ...

      
## Install

Unfortunately Meteor apps are somewhat hard to deploy. The framework was originaly intented for web apps running on a server. This is my main focus at the moment, to find an easy deployment method.

This server has to be installed on a machine connected to the stereo.

### Dependecies

First of all you need a machine running **Linux** or **OS X**.

To run the server you need some programs the app depends on:

  * [MPV Player](https://github.com/mpv-player/mpv) - To play the music
  * [Youtube-Dl](https://github.com/rg3/youtube-dl) - To download or stream the music
  * [Graphicsmagick](http://www.graphicsmagick.org) - For some image processing magic

On **OS X** this can be easily done using [Homebrew](http://brew.sh) by simply typing

```
brew install mpv youtube-dl graphicsmagick
```

On a Debian flavoured **Linux** this can be easily done by simply typing

```
sudo apt-get install mpv youtube-dl graphicsmagick
```

But be aware, that especially on **Debian** the MPV player is usually way too old.

### Dev Server

The easiest way to run it, is to install the whole Meteor development stack. This is the best way if you just need it on a laptop on a party and you're not looking for a permanent solution.

For install information look [here](https://www.meteor.com/install).

Then just [download](https://github.com/00SteinsGate00/MusicServer/archive/master.zip) or **clone** the repository using

```
git clone https://github.com/00SteinsGate00/MusicServer.git
```

From within the projects folder simply type

```
meteor npm install --save
meteor -p <port>
```
to run it on your local machine on the port specified (default is **3000**). The server can then be accesses from any device within your network, by simpling typing in your browser `<ip_of_your_device>:<port_specified>`.

### Full Deployment

To fully deploy a meteor app on your server a nice tutorial can be found [here](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-meteor-js-application-on-ubuntu-14-04-with-nginx).


### ARM Boards

This application was originally intented to run on ARM Boards like the **Raspberry Pi**. The image processing happening in the background was too heavy for a Raspberry Pi 1 Model B though. The image process can be switched off in the player's UI.

I have not yet tested it on stronger ARM boards, such as the **Raspberry Pi 3** or **Odroid**.

I will look into this as soon as possible.


## Robustness & Known Issues

This software has survived numerous parties and evenings, with little to no problems. However there still are bugs from time to time and the software is **not yet stable**.

Some issues are

  * Volumebar does not appear - reload the page until it does
  * Radio streams will break the server
  * It is nearly impossible to use with a slow internet connection

## Thanks

A big thanks goes to all the great software that this project relies on

  * [Meteor App Framework](https://meteor.com) - The app framework itself
  * [MPV Player](https://github.com/mpv-player/mpv) - For playing the music
  * [YouTube-dl](https://github.com/rg3/youtube-dl) - For downloading and streaming the music sources
  * [Node-MPV](https://github.com/00SteinsGate00/Node-MPV) - For the integration of MPV player into NodeJs
  * [Graphicsmagick](http://www.graphicsmagick.org) - For the image processing

## Future Developement

There are several plans in my head for future features

  * Easy deployment. Possibly through Docker images
  * ~~Settings, to control various things and to switch off the image processing for slower ARM boards~~
  * REST API
  * Playing local files from the server
  * Uploading files from your device
  * UI improvements
  * Stability improvements
  * Browser Extension to provide a button on YouTube, to *just click*

## Licence
 
[MIT Licence](LICENCE.md)

