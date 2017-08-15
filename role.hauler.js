var roleHarvester = require('role.harvester');

var roleCarrier = {
  run: function(creep) {
      //check if full to determine if they should collect or deliver
      if(creep.memory.full && creep.carry.energy === 0)
      {
          creep.memory.full = false;
          creep.say('♻ collecting!');
      }
      else if(!creep.memory.full && creep.carry.energy === creep.carryCapacity)
      {
          creep.memory.full = true;
          creep.say('♻ delivering!');
      }

      if(creep.memory.full)
      {

      }
      else
      {
          //check if there is a path to any dropped energy
          if(creep.memory.targetPath) {
              //check if the target path is a drop or container
              if(creep.memory.isDrop)
              {
                  //go to the target and pick it up
                  if(creep.pickup(creep.memory.target) === ERR_NOT_IN_RANGE)
                  {
                      creep.moveByPath(Room.deserializePath(creep.memory.targetPath));
                  }
              }
              else
              {
                  //go to the container and withdraw
                  if(creep.withdraw(creep.memory.target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
                  {
                      creep.moveByPath(Room.deserializePath(creep.memory.targetPath));
                  }
              }
          }
          else {
              //look for any energy that's on the ground
              var  droppedEnergies = creep.room.find(FIND_DROPPED_RESOURCES);
              if(droppedEnergies.length)
              {
                  //find the closest energy and store it and a path to it in memory
                  creep.memory.target = creep.pos.findClosestByPath(droppedEnergies);
                  creep.memory.targetPath = Room.serializePath(creep.memory.target);
                  //set the target memory to drop so the creep knows it should pickup
                  creep.memory.isDrop = true;
              }
              else
              {
                  //check for any containers that have energy
                  var containers = creep.room.find(FIND_STRUCTURES, {
                      filter: (c) => {
                          return c.structureType = STRUCTURE_CONTAINER && c.store(RESOURCE_ENERGY) < c.storeCapacity;
                      }
                  });
                  if(containers.length)
                  {
                      //find the closest and store it and its path into memory
                      creep.memory.target = creep.pos.findClosestByPath(containers);
                      creep.memory.targetPath = Room.serializePath(creep.memory.target);
                      //set the target memory to container so the creep knows to withdraw
                      creep.memory.isDrop = false;
                  }
              }
          }
      }

  }
};

module.exports = roleCarrier;

//TODO: ADD ABILITY TO DROP ENERGY OFF AT PLACES AND RESET THE PATH
//TODO: VISUALIZE PATHING
//get it if there is any and bring it to anything that needs energy
//if not, look for containers that have energy
//if any do, get it and bring it to things that need energy