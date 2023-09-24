# README

## Table of Contents

1. [Introduction](#introduction)
2. [Folder](#folder)
3. [Installation](#installation)
4. [Usage](#usage)

## Introduction

This repository represents a MyKad / MyKid webserver app which is written in NodeJS. The primary function of the app is to extract useful information using suitable card reader through [OpenSC](https://github.com/OpenSC/OpenSC) executable file. There probably no need for individual smartcard driver when using Microsoft Usbccid Smartcard Reader (WUDF) driver is installed.

Some of the information that can be extracted includes:

```
 - name
 - address1
 - address2
 - address3
 - ic
 - name2
 - gender
 - old_ic
 - state
 - nationality
 - race
 - religion
 - city
 - state
 - postcode
```

## Folder

The project compromise of the following folder/file:

- `/utils` - Contains the base functions to extract information, `MyKad.js` and `MyKid.js`.
- `/opensc` - Contains OpenSC executable file.

## Installation

To set up the webserver locally, follow the steps below:

1. Clone this repository to your local machine.
2. Install [NodeJS & NPM](https://nodejs.dev/en/) package manager to your computer. As writing, NodeJS v16.14.0 is used.
3. Install the required dependencies by running `npm install` in the project root directory.

   ```shell
   npm install
   ```

## Usage

Once the installation is complete, you can start using the webserver app and its endpoints. 
You can use tools like Postman or any HTTP client to interact with the API.

4. Connect your card reader and insert a MyKad. This have been tested using following smart card reader:

   ```txt
   - PS/SC CCID ISO7818 USB MyKad MyKid Reader by Admire IT Solutions
   - ACR39U Smart Card Reader by Advance Card System Ltd.
   ```

5. Start the webserver on local computer.

   ```shell
   npm start
   ```

6. Make an RESTful API `POST` request at `localhost:9090/api/smartcard/mykad` to fetch your MyKad details.
