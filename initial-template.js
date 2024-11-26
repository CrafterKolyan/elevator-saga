class Solution {
  #elevators
  #floors

  constructor (elevators, floors) {
    this.#elevators = elevators
    this.#floors = floors
  }

  init () {
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

  #onElevatorIdle (elevatorIdx) {}
  #onElevatorFloorButtonPressed (elevatorIdx, floorIdx) {}
  #onElevatorPassingFloor (elevatorIdx, floorIdx, direction) {}
  #onElevatorStoppedAtFloor (elevatorIdx, floorIdx) {}

  #onFloorUpButtonPressed (floorIdx) {}
  #onFloorDownButtonPressed (floorIdx) {}
}

;({
  init: (elevators, floors) => {
    const solution = new Solution(elevators, floors)
    console.log(solution)
    solution.init()
  },
  update: (dt, _elevators, _floors) => {}
})
