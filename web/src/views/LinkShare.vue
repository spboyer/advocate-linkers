<script>
/* eslint-disable no-console */

import { required, helpers } from 'vuelidate/lib/validators';

import { storage, services, tracking } from '../modules';

import IconBase from '@/components/icons/IconBase';
import IconDevTo from '@/components/icons/IconDevTo';
import IconFacebook from '@/components/icons/IconFacebook';
import IconGitHub from '@/components/icons/IconGitHub';
import IconHackerNews from '@/components/icons/IconHackerNews';
import IconLinkedIn from '@/components/icons/IconLinkedIn';
import IconMedium from '@/components/icons/IconMedium';
import IconMicrosoft from '@/components/icons/IconMicrosoft';
import IconReddit from '@/components/icons/IconReddit';
import IconStackOverflow from '@/components/icons/IconStackOverflow';
import IconTwitter from '@/components/icons/IconTwitter';
import IconYouTube from '@/components/icons/IconYouTube';
import LinkCard from '@/components/LinkCard';

/* eslint-disable */
const customURL = helpers.regex(
  'customURL',
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
);

/* eslint-enable */

export default {
  name: 'LinkShare',
  components: {
    LinkCard,
  },
  data() {
    return {
      copied: '',
      area: '',
      devops_id: '00000',
      urlToShare: '',
      longLink: '',
      shortLink: '',
      shortenerProvider: '',
      shortApiKey: '',
      shortUsername: '',
      alias: '',
      showConfigurationError: false,
    };
  },
  validations: {
    urlToShare: {
      required,
      customURL,
    },
    area: {
      required,
    },
    devops_id: {
      required,
    },
  },
  created() {
    this.getAlias();
    this.getAreas();
  },
  methods: {
    async reloadSettings() {
      await Promise.all([
        this.getAlias(),
        this.getAreas(),
        this.getShortUsername(),
        this.getShortApiKey(),
        this.getShortenerProvider(),
      ]);
    },
    copySuccess() {
      this.$toasted.show('Copied to clipboard', {
        theme: 'outline',
        position: 'top-center',
        duration: 2000,
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
    getAreas() {
      return [
              "academic",
              "aiml",
              "containers",
              "data",
              "devcloud",
              "devops",
              "dotnet",
              "enterprise",
              "green",
              "iot",
              "java",
              "javascript",
              "m365",
              "mobile",
              "modinfra",
              "modops",
              "opensource",
              "power",
              "python",
              "quantum",
              "spatial",
              "startup"
            ]
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
        this.area,
        this.devops_id,
        this.alias
      );

      const short = { apiKey: this.shortApiKey, username: this.shortUsername };

      if (this.shortenerProvider && this.shortenerProvider === 'bit.ly') {
        services.bitly.shorten(this.longLink, short).then(response => {
          this.shortLink = response;
        });
      }
      if (this.shortenerProvider && this.shortenerProvider === 'cda.ms') {
        services.cda.shorten(this.longLink).then(response => {
          this.shortLink = response;
        });
      }
    },
    addTracking(area, devops_id) {
      let ai = this.$appInsights;
      this.reloadSettings().then(() => {
        this.shortLink = '';
        this.area = area;
        this.devops_id = devops_id;
        this.longLink = tracking.addTracking(
          this.urlToShare,
          area,
          devops_id,
          this.alias
        );
        ai.trackEvent({
          name: 'addTracking',
          properties: {
            area,
            devops_id,
            alias: this.alias,
            url: this.urlToShare,
          },
        });
      });
    },
  },
};
</script>

<template>
  <div class="wrapper">
    <h1>Share a Microsoft.com Link</h1>
    <v-card class="card">
      <v-card-title>
        <h3 class="grey--text">
          Tracking link format follows: area-ID-alias
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
                  'is-valid': !$v.urlToShare.$invalid,
                }"
                aria-describedby="urlToShare-describe"
                v-model="urlToShare"
                label="Url"
                prepend-icon="link"
              ></v-text-field>
            </v-flex>
            <v-flex xs5>
              <v-select
                id="area-code"
                name="area-code"
                @blur="$v.area.$touch()"
                :class="{
                  'is-invalid': $v.area.$invalid && $v.area.$dirty,
                  'is-valid': !$v.area.$invalid,
                }"
                :items="getAreas()"
                aria-describedby="area-code-describe"
                v-model="area"
                label="Area"
                prepend-icon="area"
              ></v-select>
            </v-flex>
            <v-flex xs5>
              <v-text-field
                id="devops_id-code"
                name="devops_id-code"
                @blur="$v.devops_id.$touch()"
                :class="{
                  'is-invalid': $v.devops_id.$invalid && $v.devops_id.$dirty,
                  'is-valid': !$v.devops_id.$invalid,
                }"
                aria-describedby="devops_id-code-describe"
                v-model="devops_id"
                label="ID Link to ADO (or 00000)"
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

    <LinkCard :longLink="longLink" :shortLink="shortLink" @copy="copySuccess" />

    <!-- <v-container>
      <v-layout row wrap>
        <v-flex md4>
          <v-card light class="card" min-height="350px">
            <v-card-title primary-title>
              <div>
                <div class="headline">Social Presets</div>
                <div class="preset-text">
                  devops_id is set to <b>social</b> for the associated platform.
                </div>
                <div class="preset-example">
                  i.e. area-social-myalias
                </div>
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
                <div class="preset-text">
                  devops_id is set to
                  <b>blog</b> for the associated platform.
                </div>
                <div class="preset-example">
                  i.e. azuremedium-blog-myalias
                </div>
              </div>
            </v-card-title>
            <v-container fluid grid-list-sm>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-btn large class="btn-icon" href="#" @click="azuremedium">
                    <span style="color:#326699">
                      <icon-base icon-name="azuremedium">
                        <icon-medium @click="azuremedium" />
                      </icon-base>
                    </span>
                  </v-btn>
                </v-flex>
                <v-flex xs6>
                  <v-btn class="btn-icon" large href="#" @click="medium">
                    <span style="color:#000">
                      <icon-base icon-name="medium">
                        <icon-medium @click="medium" />
                      </icon-base>
                    </span>
                  </v-btn>
                </v-flex>
                <v-flex xs6>
                  <v-btn class="btn-icon" large href="#" @click="devto">
                    <icon-base icon-name="devto">
                      <icon-dev-to @click="devto" />
                    </icon-base>
                  </v-btn>
                </v-flex>

                <v-flex xs6>
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
                <div class="preset-text">
                  Various quick links to set devops_id. Uses the value from
                  <b>area</b>.
                </div>
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
    </v-container> -->
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
.preset-text {
  font-size: 14px;
  word-break: break-word;
  line-height: 20px;
}
.preset-example {
  font-size: 14px;
  color: #1776d2;
  line-height: 20px;
}
</style>
