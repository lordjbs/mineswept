import './style.css'
import { generateGrid } from './grid'

const app = document.querySelector("#app");

if ( app ) {
  app.appendChild(generateGrid(12, 12));
}