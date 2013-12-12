module.exports = (grunt) ->
    config =
        pkg: grunt.file.readJSON("package.json")
        jshintrc: grunt.file.readJSON(".jshintrc")
        banner: "/*! <%= pkg.name %> (<%= grunt.template.today(\"yyyy-mm-dd\") %>) */"
        dir:
            app: "app"
            dist: "app/dist"

        concat:
            vendor:
                files: [
                    src: [
                        "<%= dir.app %>/js/vendor/*.js"
                    ]
                    dest: "<%= dir.dist %>/vendor.js"
                ]
            license:
                files: [
                    src: [
                        "<%= dir.app %>/js/vendor/_license.js"
                        "<%= dir.dist %>/vendor.min.js"
                    ]
                    dest: "<%= dir.dist %>/vendor.min.js"
                ]

        cssmin:
            app:
                options:
                    banner: "<%= banner %>"
                    keepSpecialComments: 0
                    report: "min"
                files: [
                    src: "<%= dir.dist %>/app.css"
                    dest: "<%= dir.dist %>/app.min.css"
                ]

        handlebars:
            compile:
                options:
                    namespace: "templates"
                    processName: (filepath) ->
                        filepath.replace("#{config.dir.app}/js/hbs/", "")
                files: [
                    src: "<%= dir.app %>/js/hbs/**/*.hbs"
                    dest: "<%= dir.dist %>/templates.js"
                ]

        uglify:
            vendor:
                options:
                    report: "min"
                files: [
                    src: "<%= dir.dist %>/vendor.js"
                    dest: "<%= dir.dist %>/vendor.min.js"
                ]

        jshint:
            options: "<%= jshintrc %>"
            all: "<%= dir.app %>/js/*.js"

        watch:
            js:
                files: ["<%= dir.app %>/js/*.js"]
                tasks: ["jshint:all"]
            hbs:
                files: ["<%= dir.app %>/js/hbs/**/*.hbs"]
                tasks: ["handlebars"]

    grunt.initConfig(config)

    # load all grunt tasks
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks)

    # on watch events configure to only run on changed file
    grunt.event.on("watch", (action, filepath) ->
        grunt.config(["jshint", "all"], filepath)
    )

    grunt.registerTask("default", ["build"])
    grunt.registerTask("build", ["cssbuild", "jsbuild"])
    grunt.registerTask("cssbuild", ["cssmin"])
    grunt.registerTask("jsbuild", ["concat:vendor", "uglify", "concat:license"])
