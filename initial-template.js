class Elevator {
  #elevator

  constructor (elevator) {
    this.#elevator = elevator
  }

  goToFloor (floorIdx) {
    return this.#elevator.goToFloor(floorIdx)
  }

  currentFloor () {
    return this.#elevator.currentFloor()
  }

  checkDestinationQueue () {
    return this.#elevator.checkDestinationQueue()
  }

  get destinationQueue () {
    return this.#elevator.destinationQueue
  }

  set destinationQueue (value) {
    return (this.#elevator.destinationQueue = value)
  }

  goingUpIndicator (activated) {
    return this.#elevator.goingUpIndicator(activated)
  }

  goingDownIndicator (activated) {
    return this.#elevator.goingDownIndicator(activated)
  }

  maxPassengerCount () {
    return this.#elevator.maxPassengerCount()
  }

  loadFactor () {
    return this.#elevator.loadFactor()
  }

  destinationDirection () {
    return this.#elevator.destinationDirection()
  }

  getPressedFloors () {
    return this.#elevator.getPressedFloors()
  }

  on (callback_name, callback) {
    return this.#elevator.on(callback_name, callback)
  }

  stop () {
    return this.#elevator.stop()
  }
}

class Solution {
  #elevators
  #floors

  constructor (elevators, floors) {
    this.#elevators = new Array(elevators.length)
      .fill(undefined)
      .map((_, index) => new Elevator(elevators[index]))

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
