class Solution {
  #elevators
  #floors

  constructor (elevators, floors) {
    this.#elevators = elevators
    this.#floors = floors

    this.#initialize()
  }

  #initialize () {
    for (let i = 0; i < this.#elevators.length; ++i) {
      const elevator = this.#elevators[i]
      elevator.on('idle', () => this.#onElevatorIdle(i))
      elevator.on('floor_button_pressed', floorIdx =>
        this.#onElevatorFloorButtonPressed(i, floorIdx)
      )
      elevator.on('passing_floor', (floorIdx, direction) =>
        this.#onElevatorPassingFloor(i, floorIdx, direction)
      )
      elevator.on('stopped_at_floor', floorIdx =>
        this.#onElevatorStoppedAtFloor(i, floorIdx)
      )
    }

    for (let i = 0; i < this.#floors.length; ++i) {
      const elevator = this.#floors[i]
      elevator.on('up_button_pressed', () => this.#onFloorUpButtonPressed(i))
      elevator.on('down_button_pressed', () =>
        this.#onFloorDownButtonPressed(i)
      )
    }
  }

  update (dt) {
    this.#onUpdate(dt)
  }

  #onUpdate (dt) {}

  #onElevatorIdle (elevatorIdx) {}
  #onElevatorFloorButtonPressed (elevatorIdx, floorIdx) {}
  #onElevatorPassingFloor (elevatorIdx, floorIdx, direction) {}
  #onElevatorStoppedAtFloor (elevatorIdx, floorIdx) {}

  #onFloorUpButtonPressed (floorIdx) {}
  #onFloorDownButtonPressed (floorIdx) {}
}

;({
  init: (elevators, floors) => {
    this.solution = new Solution(elevators, floors)
  },
  update: (dt, _elevators, _floors) => {
    this.solution.update(dt)
  }
})
