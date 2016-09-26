# MotorMatch 


## Information
Thanks for taking a look at my project!  If you have any questions, of course feel free to reach out.  The app is built using Ionic, AngularJS, SASS, and Jade.  Additionaly, I built a small Mongoose API to support the saving of vehicles for further data analysis.  This small API is hosted on Heroku.  Link to GitHub API project: [API](https://github.com/hutchwhite/motor-match-api)

---


## Installation

### Requirements

Below you will find basic setup and deployment instructions for this project. To begin you should have the following applications installed globally on your local development system:

  + git >= 2.0.2
  + node >= 4.3.1
  + npm >= 2.11.1
  + bower >= 1.4.1

### Packages
  + `npm install`
  + `npm install -g bower`
  + `npm install -g gulp`
  + `bower install`
  + `gem install scss_lint`

---

## Gulp

### Environments

The environment can be set for `gulp default` and `gulp watch` with `--env=`.
The default environment for the `gulp watch` is `local`.  If you are not running with the locally built API, use `demo` as the environment.  Demo will hit the [API](https://github.com/hutchwhite/motor-match-api) deployed on Heroku (http://motor-match-api.herokuapp.com/api/v1/).

#### Deployment
When ready, be sure to build using `gulp --env=demo` so that the app will be correctly set for the server-side API.  If not, this will look for the local API and fail!

---


