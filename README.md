#discourse-indeed

Plugin for Discourse which adds the following features:

 - An "reply with an empty post" button to the post toolbar.

![empty reply button](https://discourse.rux-pizza.com/uploads/default/2810/ce8022d5166ccafc.png)

The button does what it says, i.e, it instantly replies to the selected post with an empty post.

![empty post](https://discourse.rux-pizza.com/uploads/default/2816/b9350ec96438ea50.png)

To enable it, be sure to add `emptyReply` to the `post menu` setting in the admin section.

![post menu setting](https://discourse.rux-pizza.com/uploads/default/2814/4166d17a1f7dda65.png)

- An "indeed" button next to the "quote reply" button when highlighting text on a post.

![indeed button](https://discourse.rux-pizza.com/uploads/default/2811/0ece16579f8106b2.png)

When pressed, it quotes the highlighted text in the composer and adds "indeed" after it.

![indeed reply](https://discourse.rux-pizza.com/uploads/default/2812/dcea13dce9c6fde0.png)

Compatible with Discourse v1.5.0.beta13 or greater, uses Plugin-API 0.1.

##Installation

* Add the plugin's repo url to your container's `app.yml` file

```yml
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - mkdir -p plugins
          - git clone https://github.com/discourse/docker_manager.git
          - git clone https://github.com/rux-pizza/discourse-indeed.git
```

* Rebuild the container

```
cd /var/docker
git pull
./launcher rebuild app
```

To enable empty replies, add `emptyReply` to the `post menu` setting in the admin section:

![post menu setting](https://discourse.rux-pizza.com/uploads/default/2814/4166d17a1f7dda65.png)

## History

The idea behind this plugin started as an inside joke in our own Discourse boards. One day the admin decided to lift the minimum post length restriction. Aimed towards allowing chat-like short messages such as "LOL" "WTF", it quickly became the norm to simply "empty reply". It became apparent that "empty replying" was the ideal choice to deal with posts that did not leave you indifferent but that were not good enough to merit a "like" or worth the effort or writing a commentary.

We took it to next level and turned it into a plugin that packages the whole thing into a single button. On a board with the default settings, it will save you from typing boilerplate HTML code that renders nothing yet be well above the minimum post length limit. Be warned, this plugin is intended to make obnoxiousness within anyone's reach at a click of a button.

As a bonus, the famous quote reply button also comes with its twin brother indeed reply. It will save you time when you wish to point out spelling or grammar mistakes from your Discourse fellows. Cookie points when leaves the OP a bitter taste."

## License

The MIT License.
