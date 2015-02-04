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

## The "jiraActions" task

### Overview
In your project's Gruntfile, add a section named `jiraActions` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({

  jiraActions: {
    createIssue: {
      options: {
        jira: {
          api_url: "https://company.atlassian.net/rest/api/2/",
          proxy : null,
          user: "your-username",     // Bad practice - You should pull JIRA_UN from ENV
          password: "your-password"  // Bad practice - You should pull JIRA_PW from ENV
        },
        project: {
          jira_id: 123456,
          name: "Foo Project",
          version: "1.0.1",
          build_label: "foo_project_1.0.1.7890"
        },
        issue: {
          type_id: 7,                 // 7 = Story
          state: 1,                   // 1 = Open, 11 = Done
          summary: "Foo Project",
          //description: 'path/to/some.json'
          description: 'This is a description of what you want'
          components: 'ACM'           // This value will be passed as a Jira field
        }
      }
    }
  }

});
```

### Options

- `jira`
    - `api_url` - Url of the Jira api root
    - `proxy` - Full url of proxy including port
    - `user` - Jira username. Default value is process.env.JIRA_UN
    - `password`  - Jira password. Default value is process.env.JIRA_PW
- `project` - Default values are those specified in package.json
    - `id` - Jira id of the project the story will be created in
    - `name` - Default is the project name specified in package.json
    - `version` - Default is the version specified in package.json
    - `build_label` - The build that created this story
- `issue` - The details of the story being created
    - `type_id` - Jira id of the type of issue to post the story as
        1 = Bug
        2 = New Feature
        3 = Task
        4 = Improvement
        5 = Sub-task
        6 = Epic
        7 = Story
        8 = Technical Task
    - `state` - The transition id that the story should end up in. Default is 1 which is Open.
    - `summary` - Default is the project name specified in package.json (displayed in the story's subject)
    - `description` - Path to a file whose contents will be the body of the story
    - OTHER attributes specified in `issue` will be passed directly to Jira via the fields collection in the JSON. For more details check [developer.atlassian.com](https://developer.atlassian.com/display/JIRADEV/JIRA+REST+API+Example+-+Create+Issue)

## Contact, feedback and bugs

This interface was not developed or reviewed by Atlassian or OpenTable. They bare no responsibility for its quality, performance, or results. Use at your own risk.

Please file bugs / issues and feature requests on the [issue tracker](https://github.com/jwtd/grunt-jira-actions/issues)

## Contributing
The code styleguide for this project is captured in the [eslint.json](https://github.com/jwtd/grunt-jira-actions/blob/master/eslint.json) file. Submissions should be accompanied by unit tests for any new or changed functionality. [esLint](http://eslint.org/) and test your code using [Grunt](http://gruntjs.com/).

## Special Thanks
* Ryan Tomlinson for the helpful write up of [OpenTable's release process](http://tech.opentable.co.uk/blog/2014/05/19/continuous-delivery-automating-deployment-visibility/)
* [OpenTable](https://github.com/opentable) - for being a progressive organization and allowing their staff to open source their tools.
* [Chris Riddle](https://github.com/christriddle) and [Bryce Catlin](https://github.com/bcatlin) for putting together [grunt-ccb](https://github.com/opentable/grunt-ccb), which this project is derived from.


## Release History
_(Nothing yet)_
