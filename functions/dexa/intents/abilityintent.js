const Fuse = require('fuse.js'),
  path = require('path'),
  {AbilityAliases} = require(path.join(__dirname, '../data/aliases')),
  {BattleAbilities} = require(path.join(__dirname, '../data/abilities')),
  {capitalizeFirstLetter, removeDiacritics} = require(path.join(__dirname, '../util')),
  {oneLine} = require('common-tags');

const abilityIntent = function (req, res) {
  try {
    const ability = removeDiacritics(req.slot('ABILITY'));

    const fsoptions = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ['alias', 'ability', 'id', 'name']
      },
      aliasFuse = new Fuse(AbilityAliases, fsoptions),
      abilityFuse = new Fuse(BattleAbilities, fsoptions),
      aliasSearch = aliasFuse.search(ability),
      abilitySearch = aliasSearch.length ? abilityFuse.search(aliasSearch[0].ability) : abilityFuse.search(ability);

    const abilityData = {
      name: capitalizeFirstLetter(abilitySearch[0].name),
      description: abilitySearch[0].desc ? abilitySearch[0].desc : abilitySearch[0].shortDesc
    };

    const final = oneLine`${abilityData.name}, ${abilityData.description}`;

    return res.say(final);
  } catch (err) {
    console.error(err);
    throw new Error('Ability not found');
  }
};

module.exports = {abilityIntent};