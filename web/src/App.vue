<template>
  <v-app class="blue lighten-5">
    <v-app-bar absolute color="primary">
      <v-toolbar-title>
        <v-btn x-large text color="white" to="/">Social Linker</v-btn>
      </v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn color="white" to="/settings" text>Settings</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <router-view></router-view>
    <v-footer fixed height="auto" color="primary" center>
      <v-layout align-center justify-center>
        <v-btn color="white" text to="/credits">Credits</v-btn>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.wrapper {
  padding: 10px;
  margin-top: 60px;
}

.v-toolbar__title {
  color: white;
}

.card {
  margin: 5px;
  padding: 5px;
}
</style>
