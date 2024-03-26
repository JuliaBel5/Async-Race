import { Controller } from './controller/controller'
import './style.scss'
import { View } from './view/view'

const view = new View()

new Controller(view)
