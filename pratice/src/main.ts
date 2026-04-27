import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { isTemplateMiddleOrTemplateTail } from 'typescript'
import ElementPlus from 'element-plus'
isTemplateMiddleOrTemplateTail
const app=createApp(App)
app.use(createPinia())
app.use(ElementPlus)
app.mount("#app")
