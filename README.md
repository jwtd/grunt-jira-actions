# grunt-jira-actions

> Grunt tasks to perform Jira actions

## Getting Started
This plugin requires Grunt `~0.4.5`

### Requirements

* Grunt `~0.4.5`
* API access to a Jira instance

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-jira-actions --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-jira-actions');
```

## The 'createJiraIssue' task

### Overview
In your project's Gruntfile, add a section named `createJiraIssue` to the data object passed into `grunt.initConfig()`. Within that section, you can create any number of targets that add Jira issues of various types. Place common values in the top level options collection. Place target specific values in their respective target's option's collections.

```js
grunt.initConfig({

  createJiraIssue: {

    // Declare options that are common to all Jira actions
    options: {
      jira_host: 'virtru.atlassian.net',
      // jira_protocol: 'https',
      // jira_port: 443,
      // jira_api_version: '2',
      // jira_un: 'your-username', // Bad practice - Better to allow task to pull JIRA_UN from ENV
      // jira_pw: 'your-password'  // Bad practice - Better to allow task to pull JIRA_PW from ENV
      project_id: 123456
    },

    // Create specific targets to perform different Jira tasks
    createOpenFooStory: {
      options: {
        issue_type_id: 7,         // 7 = Story
        issue_state: 2,           // 1 = Open, 2 = Closed
        summary: 'Summary of my issue',
        description: 'This value is the description of my issue'
      }
    }

  }

});
```

### Options

#### Environment Parameters
For security reasons, the Jira username and password are pulled from environment variables.
- process.env.JIRA_UN
- process.env.JIRA_PW

#### Target Parameters
- `jira_host` - Url of the Jira api root
- `jira_protocol` - The protocol which Jira's api uses for connections. Default is https.
- `jira_port` - The port on which Jira's api allows connections on. Default is 443.
- `jira_api_version` - The version of Jira's api to target. Default is '2'.
- `project_id` - Jira id of the project the story will be created in
- `issue_type_id` - Jira id of the type of issue to post the story as
 - 1 = Bug
 - 2 = New Feature
 - 3 = Task
 - 4 = Improvement
 - 5 = Sub-task
 - 6 = Epic
 - 7 = Story
 - 8 = Technical Task
- `issue_state` - The transition id that the story should end up in. Default is 1 which is Open. 2 is Closed.
- `summary` - Default is the project name specified in package.json (displayed in the story's subject)
- `description` - Path to a file whose contents will be the body of the story
- OTHER attributes specified in `issue` will be passed directly to Jira via the fields collection in the JSON. For more details check [developer.atlassian.com](https://developer.atlassian.com/display/JIRADEV/JIRA+REST+API+Example+-+Create+Issue)

## Contact, feedback and bugs

This interface was not developed or reviewed by Atlassian. They bare no responsibility for its quality, performance, or results. Use at your own risk.

Please file bugs / issues and feature requests on the [issue tracker](https://github.com/jwtd/grunt-jira-actions/issues)

## Contributing
The code styleguide for this project is captured in the [eslint.json](https://github.com/jwtd/grunt-jira-actions/blob/master/eslint.json) file. Submissions should be accompanied by unit tests for any new or changed functionality. [esLint](http://eslint.org/) and test your code using [Grunt](http://gruntjs.com/).

## Special Thanks
* Ryan Tomlinson for the helpful write up of [OpenTable's release process](http://tech.opentable.co.uk/blog/2014/05/19/continuous-delivery-automating-deployment-visibility/)
* [OpenTable](https://github.com/opentable) - for being a progressive organization and allowing their staff to open source their tools.
* [Chris Riddle](https://github.com/christriddle) and [Bryce Catlin](https://github.com/bcatlin) for putting together [grunt-ccb](https://github.com/opentable/grunt-ccb), which this project is derived from.


## Release History
_(Nothing yet)_
