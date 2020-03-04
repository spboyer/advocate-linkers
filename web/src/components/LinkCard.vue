<template>
  <v-card class="link-card">
    <v-flex green lighten-4>
      <v-layout flex row v-if="longLink">
        <v-card-actions>
          <v-btn
            text
            v-clipboard:copy="longLink"
            v-if="longLink"
            v-clipboard:success="copy"
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
            v-clipboard:success="copy"
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
</template>

<script>
import IconBase from './icons/IconBase';
import IconCopy from './icons/IconCopy';

export default {
  props: {
    longLink: {
      type: String,
      default: '',
    },
    shortLink: {
      type: String,
      default: '',
    },
  },
  components: {
    IconBase,
    IconCopy,
  },
  methods: {
    copy() {
      this.$emit('copy');
    },
  },
};
</script>

<style scoped>
.v-card.link-card {
  box-shadow: none;
}
.link-card {
  height: 100px;
}
</style>
