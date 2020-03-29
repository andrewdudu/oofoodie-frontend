<template>
      <md-bottom-bar class="footer phone-viewport" md-sync-route>
        <md-bottom-bar-item to="/" exact md-label="Home" md-icon="home"></md-bottom-bar-item>
        <md-bottom-bar-item to="/new" md-label="Suggest New" md-icon="add_circle"></md-bottom-bar-item>
        <md-bottom-bar-item to="/nearby" md-label="Nearby" md-icon="location_on"></md-bottom-bar-item>
        <md-bottom-bar-item to="/explore" md-label="Explore" md-icon="search"></md-bottom-bar-item>
        <md-bottom-bar-item to="/profile" md-label="Profile" md-icon="account_circle"></md-bottom-bar-item>
      </md-bottom-bar>
</template>

<script>
  export default {
    name: 'BarRouter'
  }
</script>

<style lang="scss" scoped>
$icon_color: #204732;
$active_icon_color: #339162;

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
}

.md-bottom-bar-item {
    color: $icon_color;
    text-shadow: 0px 0px 0px $icon_color;
}

.md-active {
    color: $active_icon_color;
}

.phone-viewport {
    width: 100%;
    display: inline-flex;
    align-items: flex-end;
    overflow: hidden;
    box-shadow: 0px -1px 3px #d5d1ca;
  }
</style>