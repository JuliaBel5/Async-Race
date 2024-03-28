import { Controller } from './controller/controller'
import './style.scss'
import { View } from './view/view'
import 'modern-normalize/modern-normalize.css'

const view = new View()

new Controller(view)
