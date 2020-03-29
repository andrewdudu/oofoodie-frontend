<template>
  <div class="footer">
    <div class="list-icon">
      <md-icon class="md-size-2x icon">home</md-icon>
      <span class="icon-description">Home</span>
    </div>
    <div class="list-icon">
      <md-icon class="md-size-2x icon">add_circle</md-icon>
      <span class="icon-description">Suggest New</span>
    </div>
    <div class="list-icon">
      <md-icon class="md-size-2x icon">location_on</md-icon>
      <span class="icon-description">Nearby</span>
    </div>
    <div class="list-icon">
      <md-icon class="md-size-2x icon">search</md-icon>
      <span class="icon-description">Explore</span>
    </div>
    <div class="list-icon">
      <md-icon class="md-size-2x icon">account_circle</md-icon>
      <span class="icon-description">Profile</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style lang="scss" scoped>
$icon_color: #204732;

.list-icon {
  width: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Century Gothic";
}

.icon-description {
  white-space: nowrap;
}

.icon {
  margin: 0;
  color: $icon_color;
  text-shadow: 1px 1px 2px $icon_color;
}

.footer {
  position: absolute;
  display: flex;
  justify-content: space-evenly;
  bottom: 0;
  left: 0;
  height: 80px;
  width: 100%;
  box-shadow: 0px -1px 3px #d5d1ca;
}
</style>
