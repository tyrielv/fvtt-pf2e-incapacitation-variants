# fvtt-pf2e-incapacitation-variants

Automation for several homebrew variants of the Incapacitation trait for Pathfinder 2nd Edition in Foundry VTT

## Supported Options

### Change *when* incapacitation trait affects the outcome

The [official rules](https://2e.aonprd.com/Traits.aspx?ID=93) change the outcome when a creature's level is higher than the incapacitating effect, or higher than twice the level of the spell if the effect is from a spell.

This module supports these options:

* change the level difference required to trigger the incapacitation trait. For example, you could make it apply to creature 2 levels higher instead of 1 level higher. This could be particularly useful when using Proficiency Without Level to expand the range of levels that are viable in encounter building.
* use the caster level instead of the spell level when determining the effect level of a spell. This would allow a high-level caster to incapacitate a lower-level creature using a low-level spell. (While players may love this for their spells, it makes higher level enemy spellcasters very dangerous.)
* instead of using level difference, only trigger the incapacitation trait for creatures with a particular trait. For example, you could give certain enemies the "Boss" trait to make them harder to incapacitate regardless of level, while other creatures would be easier to incapacitate even if higher level.

### Change *how* incapacitation trait affects the outcome

The official rules increase the degree of success by one (for saving throws rolled by the target) or decrease it by one (for attacks or other rolls by the effect creator).

This modules supports these options:

* Use the default option, changing the degree of success by one.
* Improve the degree of success only for the worst case. Some incapacitating effects are only incapacitating on a critically failed save. This option prevents the worst effects from hitting a powerful creature, but the incapacitating effect can still be quite potent.
* Improve the degree of success only for the worst two cases. Similar to the previous, this makes powerful effects less likely, but compared to the default option makes it much less likely that there will be no effect.
* Roll twice and keep the best. This option makes the most powerful effects much less likely, but still possible.
* Add a flat bonus. Similar effect to rolling twice, but can be adjusted more granularly.

## Licenses

Project Licensing:

* Everything in this project that is not covered by one of the following license exceptions is made available under the
  MIT License (see [LICENSE](LICENSE)).

This module uses trademarks and/or copyrights owned by Paizo Inc., used
under [Paizo's Community Use Policy (paizo.com/communityuse)](https://paizo.com/communityuse). We are expressly prohibited from
charging you to use or access this content. This module is not published, endorsed, or specifically approved by Paizo.
For more information about Paizo Inc. and Paizo products, visit [paizo.com](https://paizo.com).

Open Game License:

* See [OpenGameLicense.md](OpenGameLicense.md)


Virtual Table Top Platform Licenses:

* Foundry VTT support is covered by the following
  license: [Limited License Agreement for module development](https://foundryvtt.com/article/license/).
