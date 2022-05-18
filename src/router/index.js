import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Editor from '../views/Editor.vue'
import Article from '../views/Article.vue'
import ChatRoom from '@/views/ChatRoom.vue'
import MessageBoard from '@/views/MessageBoard.vue'
import Lab from '@/views/Lab.vue'
import Management from '@/views/Management.vue';
import ManagementContent from '@/views/ManagementContent.vue'
import ManagementCategory from '@/views/ManagementCategory.vue'
import ManagementComment from '@/views/ManagementComment.vue'
import ManagementMessage from '@/views/ManagementMessage.vue'
import ManagementUser from '@/views/ManagementUser.vue'
import ManagementTag from '@/views/ManagementTag.vue'
import ManagementEditor from '@/views/ManagementEditor.vue'
import ManagementPower from '@/views/ManagementPower.vue'
import ManagementRole from '@/views/ManagementRole.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/chatRoom',
    name: 'chatRoom',
    component: ChatRoom
  },
  {
    path: '/messageBoard',
    name: 'messageBoard',
    component: MessageBoard
  },
  {
    path: '/messageBoard',
    name: 'messageBoard',
    component: MessageBoard
  },
  {
    path: '/lab',
    name: 'lab',
    component: Lab
  },
  {
    path: '/chatRoom',
    name: 'chatRoom',
    component: ChatRoom
  },
  {
    path: '/editor',
    name: 'editor',
    component: Editor
  },
  {
    path: '/article/:id',
    name: 'article',
    component: Article
  },
  {
    path: '/managementEditor/:id',
    name: 'ManagementEditor',
    component: ManagementEditor
  },
  {
    path: '/management',
    name: 'management',
    component: Management,
    children: [{
        path: '',
        component: ManagementContent
      },
      {
        path: 'managementContent',
        component: ManagementContent
      },
      {
        path: 'managementCategory',
        component: ManagementCategory
      },
      {
        path: 'managementComment',
        component: ManagementComment
      },
      {
        path: 'managementMessage',
        component: ManagementMessage
      },
      {
        path: 'managementUser',
        component: ManagementUser
      },
      {
        path: 'managementTag',
        component: ManagementTag
      },
      {
        path: 'managementRole',
        component: ManagementRole
      },
      {
        path: 'managementPower',
        component: ManagementPower
      }
    ]
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router