# Dohyo Disco

![image](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)\
version : 1.0

## Contents

[What is it?](#what-is-it?)\
[Where is it?](#where-is-it)\
[How its made](#how-its-made)\
[Resources and Credits](#resources-and-credits)\
[How to run locally](#how-to-run-locally)\
[Outstanding features](#outstanding-features)

## What is it?

A Phaser 3 single and two player Sumo inspired game. Either single player, or two player hot seating, choose your fighter. Your character will have a keyboard button flash above their head. Press the right key quicker than your opponent to force them out of the ring. Best of three rounds to win the match.

## Where is it?

Dohyo Disco is hosted using Netlify and can be found [here](https://dohyo-disco.netlify.app/)

## How its made

Using JavaScript along with the Phaser library the game is created using Classes for each scene.

To run the game a web server needs to be running to support the game's update loop. This repo leverages a Vite config to run locally and is hosted on netlify to run in browser.

## Resources and Credits

Sprites were made using Universal LPC Spritesheet Generator, their open source project can be found [here](https://github.com/liberatedpixelcup/Universal-LPC-Spritesheet-Character-Generator).

Background images sources from [Wallpaper flare](https://www.wallpaperflare.com/)

This project has been made possible with collaboration between [Verity Gregory](https://github.com/dappernerddesigns), [Katherine Hurst](https://github.com/itskatherine), and [Niamh Smith](https://github.com/NRMSMITH). Check out their profiles and projects

## How to run locally

### Prerequisits

- node 20 and above
- code editor
- browser

1. Clone the repo
2. `cd` into the repo via terminal of choice
3. run `npm i` to install all the required dependencies
4. run `npm run start` to begin the vite server
5. visit [localhost:8000](localhost:8000) in your browser to see the game.

## Outstanding features

- Multiplayer over browser
- New stages
- More fighters
- Single player journey

### Coming soon, maybe

- Mobile play 📱
