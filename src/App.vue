<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
    border-left-width: 4px;
    border-left-color: #cccccc;
    border-left-style: solid;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
/* CSS */
html,body {
    height: 100%;
}
#app {
    height: 100%;
}
#app > div {
    height: 100%;
}
</style>
