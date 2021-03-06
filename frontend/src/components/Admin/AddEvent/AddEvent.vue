<template lang="pug">
  v-container(grid-list-lg)
    v-layout(row wrap)
      v-flex(xs12 md6)
        v-card()
          v-card-text
            v-form(ref="form")
              v-text-field(
                v-model="event.title",
                :rules="[v => !!v || 'Это обязательное поле']"
                label="Название мероприятия",
                required)
              v-text-field(
                label="Дистанция",
                :rules="[v => !!v || 'Это обязательное поле']"
                v-model="event.distance",
                required)
              v-text-field(
                v-model="event.location"
                :rules="[v => !!v || 'Это обязательное поле']"
                label="Место проведения",
                required)
              v-text-field(
                v-model="event.sponsor"
                :rules="[v => !!v || 'Это обязательное поле']"
                label="Организатор (наименование)",
                required)
              v-text-field(
                v-model="event.sponsorLink"
                :rules="[v => !!v || 'Это обязательное поле']"
                label="Ссылка на сайт организатора",
                required)
              v-text-field(
                v-model="event.videoLink"
                label="Ссылка на видео с youtube")
              v-menu(
                ref="menu"
                :close-on-content-click="false"
                v-model="menu"
                full-width
                min-width="290px")
                v-text-field(
                  slot="activator"
                  v-model="event.date"
                  :rules="[v => !!v || 'Это обязательное поле']",
                  label="Дата мероприятия",
                  required)
                v-date-picker(
                  no-title
                  scrollable
                  ref="picker"
                  locale="ru"
                  v-model="event.date"
                  @change="save")
              v-text-field(
                v-model="event.lat",
                :rules="[v => !!v || 'Это обязательное поле']",
                required,
                type="number",
                label="Координат Gps - LAT")
              v-text-field(
                v-model="event.lng",
                :rules="[v => !!v || 'Это обязательное поле']",
                required,
                type="number",
                label="Координаты Gps -LNG")
      v-flex(xs12 md6)
        v-card()
          v-card-title
            v-layout(row justify-center)
              div.image-preview
                img(
                  src=''
                  ref="preview")
          v-card-text
            label(for="file" class="label")
              v-icon.mr-2 photo
              span Загрузить превью
            input(type="file" ref="file" @change="fileChange" id="file")
    v-layout(row justify-center)
      v-flex(xs12)
        v-card()
          v-card-text
            v-textarea(
            label="Описание эвента",
            v-model="event.description").mb-3
            quill-editor(
            :content="event.content"
            ref="myQuillEditor"
            @change="onEditorChange($event)")
    v-btn(color="primary", @click.prevent="editEvent", v-if="edit").my-4 Сохранить
    v-btn(color="primary", @click.prevent="addEvent", :loading="addEventBtn", v-else).my-4 Добавить
    Notification
</template>

<script>
import { mapState } from 'vuex'
import Notification from '../../Common/Notiifcation/Notification'
import nanoid from 'nanoid'
export default {
  name: 'AddEvent',
  components: { Notification },
  props: {
    edit: {
      type: Boolean,
      default: false,
      required: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    event: {
      title: '',
      location: '',
      lat: '',
      lng: '',
      distance: '',
      date: '',
      sponsor: '',
      sponsorLink: '',
      imagePreview: [],
      content: '',
      description: '',
      videoLink: ''
    },
    menu: false,
    hasImage: false
  }),
  mounted () {
    this.mutationSubscribe()
  },
  watch: {
    'event.imagePreview': {
      deep: true,
      handler: function (val) {
        if (val) {
          let reader = new FileReader()
          reader.addEventListener(
            'load',
            function () {
              this.$refs.preview.src = reader.result
            }.bind(this),
            false
          )
          reader.readAsDataURL(this.event.imagePreview)
        }
      }
    },
    eventForEdit (val) {
      if (this.edit) {
        this.event.title = val.title
        this.event.distance = val.distance
        this.event.location = val.location
        this.event.sponsor = val.sponsor
        this.event.sponsorLink = val.sponsorLink
        this.event.date = val.date
        this.event.videoLink = val.videoLink
        this.event.lat = val.gps[0]
        this.event.lng = val.gps[1]
        this.event.description = val.description
        this.event.content = val.content
      }
    }
  },
  computed: {
    ...mapState({
      addEventBtn: state => state.admin.loading.addEventBtn,
      eventForEdit: state => state.admin.eventForEdit
    }),
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
    fileChange () {
      this.event.imagePreview = this.$refs.file.files[0]
    },
    save (date) {
      this.$refs.menu.save(date)
    },
    addEvent () {
      if (this.$refs.form.validate()) {
        const formData = new FormData()
        const id = nanoid()
        formData.append('dirId', id)
        Object.entries(this.event).forEach(([key, value]) => formData.append(key, value))
        this.$store.dispatch('ADD_NEW_EVENT_PREVIEW', formData)
      } else {
        this.$store.dispatch('NOTIFICATION', { open: true, color: 'error', text: 'Необходимо заполнить все поля!' })
      }
    },
    mutationSubscribe () {
      this.$store.subscribe((mutation, state) => {
        switch (mutation.type) {
          case 'ADD_NEW_EVENT_SUCCESS':
            this.$store.dispatch('NOTIFICATION', { open: true, color: 'success', text: state.admin.newEvent.message })
            this.$refs.file.value = ''
            this.$refs.preview.src = ''
            this.$refs.form.reset()
            this.event.description = ''
            this.event.content = ''
            break
          case 'ADD_NEW_EVENT_ERROR':
            this.$store.dispatch('NOTIFICATION', { open: true, color: 'error', text: state.admin.errors.newEventError })
            break
        }
      })
    },
    onEditorChange ({ quill, html, text }) {
      this.event.content = html
    },
    editEvent () {
      const formData = new FormData()
      Object.entries(this.event).forEach(([key, value]) => formData.append(key, value))
      formData.delete('imagePreview')
      this.$store.dispatch('EDIT_EVENT', { formData, id: this.id })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .v-card {
    padding: 16px;
    &__title {
      .image-preview {
        width: 100%;
        img {
          max-width: 100%;
        }
      }
    }
  }
  input[type='file'] {
    display: none;
  }
  .label {
    border: 1px solid #c3c3c3;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
    span {
      display: inline-block;
      transform: translateY(-3px);
    }
  }
  .v-btn {
    max-width: 200px;
    width: 100%;
    height: 45px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
  }
}
</style>
