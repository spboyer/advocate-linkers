<script>
/* eslint-disable no-console */

import storage from '../modules/storage';
import service from '../modules/services';
import tracking from '../modules/tracking';

import IconMicrosoft from './icons/IconMicrosoft.vue';

import IconTwitter from './icons/IconTwitter.vue';
import IconLinkedIn from './icons/IconLinkedIn.vue';
import IconReddit from './icons/IconReddit.vue';
import IconFacebook from './icons/IconFacebook.vue';
import IconStackOverflow from './icons/IconStackOverflow.vue';
import IconHackerNews from './icons/IconHackerNews.vue';
import IconMedium from './icons/IconMedium.vue';
import IconDevTo from './icons/IconDevTo.vue';
import IconYouTube from './icons/IconYouTube.vue';
import IconGitHub from './icons/IconGitHub.vue';
import IconCopy from './icons/IconCopy.vue';
import IconBase from './IconBase.vue';

import { required, helpers } from 'vuelidate/lib/validators';

/* eslint-disable */
const customURL = helpers.regex(
  'customURL',
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
);

/* eslint-enable */

export default {
  name: 'LinkShare',
  components: {
    IconBase,
    IconTwitter,
    IconLinkedIn,
    IconReddit,
    IconFacebook,
    IconStackOverflow,
    IconHackerNews,
    IconMedium,
    IconDevTo,
    IconYouTube,
    IconGitHub,
    IconCopy,
    IconMicrosoft
  },
  data() {
    return {
      copied: '',
      tactic: '',
      category: '',
      urlToShare: '',
      longLink: '',
      shortLink: '',
      shortenerProvider: '',
      shortApiKey: '',
      shortUsername: '',
      alias: '',
      showConfigurationError: false
    };
  },
  validations: {
    urlToShare: {
      required,
      customURL
    },
    tactic: {
      required
    },
    category: {
      required
    }
  },
  mounted() {},
  methods: {
    async reloadSettings() {
      await Promise.all([
        this.getAlias(),
        this.getShortUsername(),
        this.getShortApiKey(),
        this.getShortenerProvider()
      ]);
    },
    handleSuccess() {
      this.$toasted.show('Copied to clipboard', {
        theme: 'outline',
        position: 'top-center',
        duration: 2000
      });
    },
    /* eslint-disable */
    getAlias() {
      return storage.getters
        .alias()
        .then(result => (this.alias = result))
        .catch(err => console.error(err));
    },
    getShortUsername() {
      return storage.getters
        .shortUsername()
        .then(result => (this.shortUsername = result))
        .catch(err => console.error(err));
    },
    getShortApiKey() {
      return storage.getters
        .shortApiKey()
        .then(result => (this.shortApiKey = result))
        .catch(err => console.error(err));
    },
    getShortenerProvider() {
      return storage.getters
        .shortenerProvider()
        .then(result => (this.shortenerProvider = result));
    },
    /* eslint-enable */
    async create() {
      await this.reloadSettings();

      if (!this.alias || !this.shortenerProvider) {
        this.showConfigurationError = true;
        return;
      } else {
        this.showConfigurationError = false;
      }
      this.longLink = tracking.addTracking(
        this.urlToShare,
        this.tactic,
        this.category,
        this.alias
      );

      const short = { apiKey: this.shortApiKey, username: this.shortUsername };

      if (this.shortenerProvider && this.shortenerProvider === 'bit.ly') {
        service.bitly.shorten(this.longLink, short).then(response => {
          this.shortLink = response;
        });
      }
      if (this.shortenerProvider && this.shortenerProvider === 'cda.ms') {
        service.cda.shorten(this.longLink).then(response => {
          this.shortLink = response;
        });
      }
    },
    addTracking(tactic, category) {
      let ai = this.$appInsights;
      this.reloadSettings().then(() => {
        this.shortLink = '';
        this.tactic = tactic;
        this.category = category;
        this.longLink = tracking.addTracking(
          this.urlToShare,
          tactic,
          category,
          this.alias
        );
        ai.trackEvent({
          name: 'addTracking',
          properties: {
            tactic,
            category,
            alias: this.alias,
            url: this.urlToShare
          }
        });
      });
    },
    twitter() {
      this.addTracking('social', 'twitter');
    },
    linkedin() {
      this.addTracking('social', 'linkedin');
    },
    reddit() {
      this.addTracking('social', 'reddit');
    },
    facebook() {
      this.addTracking('social', 'facebook');
    },
    stackoverflow() {
      this.addTracking('social', 'stackoverflow');
    },
    hackernews() {
      this.addTracking('social', 'hackernews');
    },
    azuremedium() {
      this.addTracking('azuremedium', 'blog');
    },
    medium() {
      this.addTracking('medium', 'blog');
    },
    youtube() {
      this.addTracking(this.tactic, 'youtube');
    },
    github() {
      this.addTracking(this.tactic, 'github');
    },
    devto() {
      this.addTracking('devto', 'blog');
    },
    microsoft() {
      this.addTracking('itopstalk', 'blog');
    }
  },
  created() {
    this.getAlias();
  }
};
</script>

<template>
  <div class="wrapper">
    <v-card class="link-card" v-if="longLink">
      <v-flex green lighten-4>
        <v-card-title primary-title>
          <h1 class="headline">Link Created!</h1>
        </v-card-title>
        <v-layout flex row>
          <v-card-actions>
            <v-btn
              text
              v-clipboard:copy="longLink"
              v-if="longLink"
              v-clipboard:success="handleSuccess"
            >
              <icon-base icon-name="copy" width="30px" height="30px">
                <icon-copy />
              </icon-base>
              {{ longLink }}
            </v-btn>

            <v-btn
              text
              v-clipboard:copy="shortLink"
              v-if="shortLink"
              v-clipboard:success="handleSuccess"
            >
              <icon-base icon-name="copy" width="30px" height="30px">
                <icon-copy />
              </icon-base>
              {{ shortLink }}
            </v-btn>
          </v-card-actions>
        </v-layout>
      </v-flex>
    </v-card>
    <h1>Share a Microsoft.com Link</h1>
    <v-card class="card">
      <v-card-title>
        <h3 class="grey--text">
          Tracking link format follows: tactic-category-alias
        </h3>
      </v-card-title>
      <v-flex md6 offset-md3>
        <v-alert type="warning" v-show="!alias">
          Beware, you have not yet set your Microsoft alias, needed to build
          this link. Go to
          <router-link to="/settings">Settings</router-link>&nbsp;to set your
          alias.
        </v-alert>
      </v-flex>
      <v-form>
        <v-container>
          <v-flex md6 offset-md3>
            <v-alert
              outlined
              :value="true"
              type="error"
              v-show="showConfigurationError"
            >
              Shortener Configuration Missing. Please go to
              <router-link to="/settings">Settings</router-link>&nbsp;to
              configure the missing settings
            </v-alert>
          </v-flex>
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                name="urlToShare"
                @blur="$v.urlToShare.$touch()"
                :class="{
                  'is-invalid': $v.urlToShare.$invalid && $v.urlToShare.$dirty,
                  'is-valid': !$v.urlToShare.$invalid
                }"
                aria-describedby="urlToShare-describe"
                v-model="urlToShare"
                label="Url"
                prepend-icon="link"
              ></v-text-field>
            </v-flex>
            <v-flex xs5>
              <v-text-field
                id="tactic-code"
                name="tactic-code"
                @blur="$v.tactic.$touch()"
                :class="{
                  'is-invalid': $v.tactic.$invalid && $v.tactic.$dirty,
                  'is-valid': !$v.tactic.$invalid
                }"
                aria-describedby="tactic-code-describe"
                v-model="tactic"
                label="Tactic"
                prepend-icon="tactic"
              ></v-text-field>
            </v-flex>
            <v-flex xs5>
              <v-text-field
                id="category-code"
                name="category-code"
                @blur="$v.category.$touch()"
                :class="{
                  'is-invalid': $v.category.$invalid && $v.category.$dirty,
                  'is-valid': !$v.category.$invalid
                }"
                aria-describedby="category-code-describe"
                v-model="category"
                label="Category"
                prepend-icon="input"
              ></v-text-field>
            </v-flex>
            <v-flex md2>
              <v-btn
                :disabled="$v.$invalid"
                v-on:click="create"
                large
                color="primary"
                >Create Link</v-btn
              >
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card>

    <v-container>
      <v-layout row wrap>
        <v-flex md4>
          <v-card light class="card" min-height="350px">
            <v-card-title primary-title>
              <div>
                <div class="headline">Social Presets</div>
                <span>
                  category is set to
                  <b>social</b> for the associated platform. i.e.
                  ?WT.mc_id=tactic-social-myalias
                </span>
              </div>
            </v-card-title>
            <v-container fluid grid-list-sm>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-btn class="btn-icon" large href="#" @click="twitter">
                    <icon-base icon-name="twitter">
                      <icon-twitter />
                    </icon-base>
                  </v-btn>
                </v-flex>
                <v-flex xs6>
                  <v-btn class="btn-icon" large href="#" @click="linkedin">
                    <icon-base icon-name="linkedin">
                      <icon-linked-in @click="linkedin" />
                    </icon-base>
                  </v-btn>
                </v-flex>
                <v-flex xs6>
                  <v-btn class="btn-icon" large href="#" @click="reddit">
                    <icon-base icon-name="reddit">
                      <icon-reddit @click="reddit" />
                    </icon-base>
                  </v-btn>
                </v-flex>
                <v-flex xs6>
                  <v-btn class="btn-icon" large href="#" @click="facebook">
                    <icon-base icon-name="facebook">
                      <icon-facebook @click="facebook" />
                    </icon-base>
                  </v-btn>
                </v-flex>
                <v-flex xs6>
                  <v-btn class="btn-icon" large href="#" @click="stackoverflow">
                    <icon-base icon-name="stackoverflow">
                      <icon-stack-overflow @click="stackoverflow" />
                    </icon-base>
                  </v-btn>
                </v-flex>
                <v-flex xs6>
                  <v-btn class="btn-icon" large href="#" @click="hackernews">
                    <icon-base icon-name="hackernews">
                      <icon-hacker-news @click="hackernews" />
                    </icon-base>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
        <v-flex md4>
          <v-card light class="card" min-height="350px">
            <v-card-title primary-title>
              <div>
                <div class="headline">Blog Presets</div>
                <span>
                  category is set to
                  <b>blog</b> for the associated platform. i.e.
                  ?WT.mc_id=azuremedium-blog-myalias
                </span>
              </div>
            </v-card-title>
            <v-container fluid grid-list-sm>
              <v-layout row wrap>
                <v-flex md4>
                  <v-btn large class="btn-icon" href="#" @click="azuremedium">
                    <span style="color:#326699">
                      <icon-base icon-name="azuremedium">
                        <icon-medium @click="azuremedium" />
                      </icon-base>
                    </span>
                  </v-btn>
                </v-flex>
                <v-flex md4>
                  <v-btn class="btn-icon" large href="#" @click="medium">
                    <span style="color:#000">
                      <icon-base icon-name="medium">
                        <icon-medium @click="medium" />
                      </icon-base>
                    </span>
                  </v-btn>
                </v-flex>
                <v-flex md4>
                  <v-btn class="btn-icon" large href="#" @click="devto">
                    <icon-base icon-name="devto">
                      <icon-dev-to @click="devto" />
                    </icon-base>
                  </v-btn>
                </v-flex>

                <v-flex md4>
                  <v-btn class="btn-icon" large href="#" @click="microsoft">
                    <icon-base icon-name="ITOpsTalk">
                      <icon-microsoft @click="microsoft" />
                    </icon-base>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
        <v-flex md4>
          <v-card light class="card" min-height="350px">
            <v-card-title primary-title>
              <div>
                <div class="headline">Other Presets</div>
                <span>
                  Various quick links to set category. Uses the value from
                  <b>tactic</b>.
                </span>
              </div>
            </v-card-title>

            <v-container fluid grid-list-sm>
              <v-layout row wrap>
                <v-flex md6>
                  <v-btn class="btn-icon" large href="#" @click="youtube">
                    <icon-base icon-name="youtube">
                      <icon-you-tube @click="youtube" />
                    </icon-base>
                  </v-btn>
                </v-flex>
                <v-flex md6>
                  <v-btn class="btn-icon" large href="#" @click="github">
                    <icon-base icon-name="github">
                      <icon-git-hub @click="github" />
                    </icon-base>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<style scoped>
.link-card {
  margin: 5px;
}
.btn-icon {
  padding: 10px;
  margin: 10px;
}
.icon {
  margin: 10px;
}
</style>
