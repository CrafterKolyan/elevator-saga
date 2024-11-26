class Elevator {
  #elevator
  #idling

  constructor (elevator) {
    this.#elevator = elevator
    this.#idling = true
  }

  goToFloor (floorIdx) {
    this.idling = false
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

  pressedFloors () {
    return this.#elevator.getPressedFloors()
  }

  on (callback_name, callback) {
    return this.#elevator.on(callback_name, callback)
  }

  stop () {
    return this.#elevator.stop()
  }

  overrideDestinationQueue (destinationQueue) {
    if (destinationQueue.length > 0) {
      this.idling = false
    }
    this.destinationQueue = destinationQueue
    this.checkDestinationQueue()
  }

  get idling () {
    return this.#idling || this.destinationQueue.length === 0
  }

  set idling (value) {
    return (this.#idling = value)
  }
}

class Solution {
  #elevators
  #floors

  #currentlyWaiting
  #currentlyProcessed

  constructor (elevators, floors) {
    this.#elevators = new Array(elevators.length)
      .fill(undefined)
      .map((_, index) => new Elevator(elevators[index]))
    this.#floors = floors

    this.#initialize()
  }

  #initialize () {
    this.#currentlyWaiting = new Array(this.#floors.length)
      .fill(undefined)
      .map(() => [false, false])
    this.#currentlyProcessed = new Array(this.#floors.length)
      .fill(undefined)
      .map(() => false)

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

  #onElevatorIdle (elevatorIdx) {
    if (this.#goToNearestPressedFloorIfAny(elevatorIdx)) {
      return
    }
    const elevator = this.#elevators[elevatorIdx]

    for (let i = 0; i < this.#currentlyWaiting.length; ++i) {
      const anyoneWaitingOnFloor =
        this.#currentlyWaiting[i][0] || this.#currentlyWaiting[i][1]
      const currentlyProcessed = this.#currentlyProcessed[i]

      if (anyoneWaitingOnFloor && !currentlyProcessed) {
        elevator.overrideDestinationQueue([i])
        this.#currentlyProcessed[i] = true
        return
      }
    }

    elevator.overrideDestinationQueue([Math.floor(this.#floors.length / 2)])
    elevator.idling = true
  }

  #onElevatorFloorButtonPressed (elevatorIdx, floorIdx) {
    this.#goToNearestPressedFloorIfAny(elevatorIdx)
  }

  #onElevatorPassingFloor (elevatorIdx, floorIdx, direction) {}

  #onElevatorStoppedAtFloor (elevatorIdx, floorIdx) {
    this.#currentlyWaiting[floorIdx][0] = false
    this.#currentlyWaiting[floorIdx][1] = false
    this.#currentlyProcessed[floorIdx] = false
  }

  #onFloorUpButtonPressed (floorIdx) {
    this.#currentlyWaiting[floorIdx][1] = true
    this.#checkForIdlingElevators()
  }

  #onFloorDownButtonPressed (floorIdx) {
    this.#currentlyWaiting[floorIdx][0] = true
    this.#checkForIdlingElevators()
  }

  #checkForIdlingElevators () {
    for (let i = 0; i < this.#elevators.length; ++i) {
      const elevator = this.#elevators[i]
      if (elevator.idling) {
        this.#onElevatorIdle(i)
      }
    }
  }

  #goToNearestPressedFloorIfAny (elevatorIdx) {
    const elevator = this.#elevators[elevatorIdx]
    const pressedFloors = elevator.pressedFloors()
    if (pressedFloors.length === 0) {
      return false
    }
    const currentFloor = elevator.currentFloor()

    let minIdx = 0
    for (let i = 1; i < pressedFloors.length; ++i) {
      if (
        Math.abs(pressedFloors[i] - currentFloor) <
        Math.abs(pressedFloors[minIdx] - currentFloor)
      ) {
        minIdx = i
      }
    }
    elevator.overrideDestinationQueue([pressedFloors[minIdx]])
    return true
  }
}

;({
  init: (elevators, floors) => {
    this.solution = new Solution(elevators, floors)
  },
  update: (dt, _elevators, _floors) => {
    this.solution.update(dt)
  }
})
