import { Leva, useControls, button } from 'leva'
import { useState } from 'react'

// const [trigger, setTrigger] = useState();
export const parallaxcontrols = {
  _displacement: { value: 0, min: -.05, max: .05, step: .001 },
  _steps: { value: 2, min: 0, max: 100, step: 1 },
  _height: { value: 1., min: 0, max: 5, step: .01 },
  _scale: { value: 7, min: 0, max: 10, step: .01 },
  _startdepth: { value: 0, min: 0, max: 10, step: .01 },
}