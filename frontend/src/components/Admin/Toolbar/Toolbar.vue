<template lang="pug">
  .nav
    v-navigation-drawer(app, temporary, v-model="drawer", width="250")
      v-toolbar(flat class="transparent")
        v-list
          v-list-tile(avatar)
            // v-list-tile-avatar
              img(src="https://randomuser.me/api/portraits/men/85.jpg")
            v-list-tile-content
              v-list-tile-title John Dow
            v-list-tile-action
              v-btn(icon)
                v-icon(
                  color="grey darken-2",
                  @click.prevent="drawer = !drawer") close
      v-list
        v-list-tile(to="/admin/events-list")
          v-list-tile-action
            v-icon library_books
          v-list-tile-content
            v-list-tile-title Список эвентов
        v-list-tile(to="/admin/add-event")
          v-list-tile-action
            v-icon note_add
          v-list-tile-content
            v-list-tile-title Добавить эвент
    v-toolbar(flat color="white")
      v-toolbar-side-icon(
        @click.prevent="drawer = !drawer")
      v-spacer
      v-toolbar-items
        v-btn(
        flat,
        color="grey darken-2",
        v-for="item in menu",
        :key="item.title",
        :to="item.link")
          v-icon.mr-2 {{ item.icon }}
          span {{ item.title }}
        v-btn(
          flat,
          color="grey darken-2",
          @click.prevent="logout")
          v-icon.mr-2 exit_to_app
          span Выход
</template>

<script>
export default {
  name: 'Toolbar',
  data () {
    return {
      drawer: false,
      menu: [
        { icon: 'account_box', title: 'Кабинет' }
      ]
    }
  },
  methods: {
    routerLink (link) {
      this.$router.push({ path: `${link}` })
    },
    logout () {
      this.$store.dispatch('LOGOUT')
    }
  }
}
</script>

<style lang="scss" scoped></style>
