---
title: Java Builds
---

The [Java buildpack](https://github.com/heroku/heroku-buildpack-java) detects if your
build is Java by looking for a `pom.xml` file. If found, Maven will download all
dependencies and build the project.

## Setting up your POM.XML file

If your app has any dependencies, the `pom.xml` file should include the `maven-dependency-plugin`. 

It tells Maven to copy the jar files that your app depends on to the target/dependency directory.

Because we use Cloudnative Buildpacks, the `pom.xml` file needs to have a compatible structure to produce a correct build slug for Java. 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <version>1.0-SNAPSHOT</version>
    <artifactId>helloworld</artifactId>
    <dependencies>
        ...
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-dependency-plugin</artifactId>
                <version>3.0.1</version>
                <executions>
                    <execution>
                        <id>copy-dependencies</id>
                        <phase>package</phase>
                        <goals><goal>copy-dependencies</goal></goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

## Specify Java version

You can specify a Java version by adding a file called system.properties to your application.

Then set a java.runtime.version in the file:
```
java.runtime.version=13
```

## Sample Java Procfile

Keep in mind, you must specify a `PORT` variable for the web process to expose the server to the internet.

```
web: java $JAVA_OPTS -cp target/classes:target/dependency/* com.example.MyJavaApplication
```
