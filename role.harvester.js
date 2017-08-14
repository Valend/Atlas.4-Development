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
                    creep.say('✈ onwards!')
                }
                else
                {
                    //check if a container id is stored in memory
                    if(creep.memory.containerID)
                    {
                        //repair the container if it is damaged
                        if(creep.memory.containerID.hits < creep.memory.containerID.hitsMax)
                        {
                            creep.repair(creep.memory.containerID);
                            creep.say('🛠 repairing!');
                        }
                        else
                        {
                            creep.say('⛏ harvesting!');
                        }
                    }
                    else
                    {
                        //check for a container below
                        var containers = creep.room.find(FIND_STRUCTURES, {
                            filter: (s) => {
                                return s.structureType === STRUCTURE_CONTAINER;
                            }
                        });
                        for(var c = 0; c < containers.length; c++)
                        {
                            if(creep.pos === containers[c].pos)
                            {
                                //if there is one, set it as the container id in memory
                                creep.memory.containerID = containers[c];
                                creep.say('container stored!');
                            }
                        }
                    }
                }
                //keep mining for the rest of your life
                //just drop excess resource below you
            }
            else
            {
                //create a path to the source, store it in memory
                creep.memory.sourcePath = Room.serializePath(creep.pos.findClosestByPath(creep.memory.sourceID));
                creep.say('path stored!');
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
                                creep.say('source stored!');
                            }
                            /*
                            there should never be a harvester without a source because the max harvesters should be
                            the number of sources
                            */
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;