# fvtt-pf2e-incapacitation-variants
![](https://img.shields.io/endpoint?url=https%3A%2F%2Ffoundryshields.com%2Fversion%3Fstyle%3Dflat%26url%3Dhttps://raw.githubusercontent.com/tyrielv/fvtt-pf2e-incapacitation-variants/main/module.json)
![](https://img.shields.io/endpoint?url=https%3A%2F%2Ffoundryshields.com%2Fsystem%3FnameType%3Dfull%26showVersion%3D1%26style%3Dflat%26url%3Dhttps://raw.githubusercontent.com/tyrielv/fvtt-pf2e-incapacitation-variants/main/module.json)

![](https://img.shields.io/github/release-date/tyrielv/fvtt-pf2e-incapacitation-variants)

![](https://img.shields.io/github/downloads/tyrielv/fvtt-pf2e-incapacitation-variants/total?label=All%20Downloads)
![](https://img.shields.io/github/downloads-pre/tyrielv/fvtt-pf2e-incapacitation-variants/latest/total?label=Latest%20version)
![](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ffvtt-pf2e-incapacitation-variants&colorB=4aa94a)

Automation for several homebrew variants of the Incapacitation trait for Pathfinder 2nd Edition in Foundry VTT

## Supported Options

### Change *when* incapacitation trait affects the outcome

The [official rules](https://2e.aonprd.com/Traits.aspx?ID=93) change the outcome when a creature's level is higher than the incapacitating effect, or higher than twice the level of the spell if the effect is from a spell.

This module supports these options:

* change the level difference required to trigger the incapacitation trait. For example, you could make it apply to creature 2 levels higher instead of 1 level higher. This could be particularly useful when using Proficiency Without Level to expand the range of levels that are viable in encounter building.
* use the caster level instead of 2 x spell rank when determining the effect level of a spell. This would allow a high-level caster to incapacitate a lower-level creature using a low-level spell. (While players may love this for their spells, it makes higher level enemy spellcasters very dangerous.)
  * Alternatively, take the better of caster level or 2 x spell rank, to preserve the slight boost for max-level spells on odd character levels.
  * Alternatively, take the spell rank + half the caster level (rounded down). This is a middle ground between caster level and spell rank, allowing higher-level casters to not need to upcast as much against lower-level targets while still requiring them to upcast.
* instead of using level difference, only trigger the incapacitation trait for creatures with a particular trait. For example, you could give certain enemies the "Boss" trait to make them harder to incapacitate regardless of level, while other creatures would be easier to incapacitate even if higher level.

In combination with any of the other options, the incapacitation trait can also be configured to disable when a creature is below an HP threshold (e.g. 50%).

### Change *how* incapacitation trait affects the outcome

The official rules increase the degree of success by one (for saving throws rolled by the target) or decrease it by one (for attacks or other rolls by the effect creator).

This modules supports these options:

* Use the default option, changing the degree of success by one.
* Improve the degree of success only for the worst case. Some incapacitating effects are only incapacitating on a critically failed save. This option prevents the worst effects from hitting a powerful creature, but the incapacitating effect can still be quite potent.
* Improve the degree of success only for the worst two cases. Similar to the previous, this makes powerful effects less likely, but compared to the default option makes it much less likely that there will be no effect.
* Roll twice and keep the best. This option makes the most powerful effects much less likely, but still possible.
* Add a flat bonus. Similar effect to rolling twice, but can be adjusted more granularly.
* Add a bonus that scales with level (ie each additional level above the threshold adds the bonus again).
* Change the degrees of success improved depending on HP:
  * \>75%: All degrees of success are improved.
  * 50%-75%: Worst 2 degrees of success are improved.
  * 25%-50%: Worst degree of success is improved.
  * \<25%: Incapacitation trait has no effect.

## Licenses

Project Licensing:

* Everything in this project that is not covered by one of the following license exceptions is made available under the
  Apache 2.0 License: (see [LICENSE](LICENSE)).

* This repository was based on https://github.com/xdy/xdy-pf2e-workbench, under the Apache 2.0 License.
In particular, the 'types' directory was copied from that project, with minor modifications to update some API signatures that this project uses, and most files in the repository root are modified from their equivalents in that project to fit the needs of this one.

This module uses trademarks and/or copyrights owned by Paizo Inc., used
under [Paizo's Community Use Policy (paizo.com/communityuse)](https://paizo.com/communityuse). We are expressly prohibited from
charging you to use or access this content. This module is not published, endorsed, or specifically approved by Paizo.
For more information about Paizo Inc. and Paizo products, visit [paizo.com](https://paizo.com).

Open Game License:

* See [OpenGameLicense.md](OpenGameLicense.md)

Virtual Table Top Platform Licenses:

* Foundry VTT support is covered by the following
  license: [Limited License Agreement for module development](https://foundryvtt.com/article/license/).

