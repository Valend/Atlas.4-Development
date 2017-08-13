var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //Max Body: WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE

        //Check if the creep has been assigned a source
        if(creep.memory.sourceID)
        {
            //check if there is a source path stored in memory
            if(creep.memory.sourcePath)
            {
                //check if you can harvest the source
                if(creep.harvest(creep.memory.sourceID) === ERR_NOT_IN_RANGE)
                {
                    //go to the source
                    creep.moveByPath(Room.deserializePath(creep.memory.sourcePath));
                }
                //keep mining for the rest of your life
                //just drop excess resource below you

                //TODO: AUTO-REPAIR CONTAINER BELOW HARVESTER
                //heal the container below you with the internal energy, if there is a container
            }
            else
            {
                //create a path to the source, store it in memory
                creep.memory.sourcePath = Room.serializePath(creep.pos.findClosestByPath(creep.memory.sourceID));
            }
        }
        else
        {
            //find an unoccupied source; only one miner per source
            //find the sources
            var sources = creep.room.find(FIND_SOURCES);
            //find all creeps with the harvester role
            for(let otherName in Game.creeps) {
                var otherCreep = Game.creeps(otherName)
                if(otherCreep.memory.role === 'harvester')
                {
                    //check if any other harvester has been assigned a source
                    if(otherCreep.memory.sourceID) {
                        //compare it with this creeps sources and try to find an available source
                        for(var s = 0; s < sources.length; s++) {
                            if(sources[s].id !== otherCreep.memory.sourceID)
                            {
                                //if there's an available source, snatch it
                                creep.memory.sourceID = sources[s];
                            }
                            //there should never be a harvester without a source because the max harvesters should be
                            //the number of sources
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;