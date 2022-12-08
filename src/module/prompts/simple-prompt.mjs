import { sendActionDataToChat } from '../rolls/roll-helpers.mjs';

/**
 *
 * @param simpleSkillData {SimpleSkillData}
 * @returns {Promise<void>}
 */
export async function prepareSimpleRoll(simpleSkillData) {
    const html = await renderTemplate('systems/dark-heresy-2nd/templates/prompt/simple-roll-prompt.hbs', simpleSkillData);
    let dialog = new Dialog(
        {
            title: 'Roll Modifier',
            content: html,
            buttons: {
                roll: {
                    icon: "<i class='dh-material'>casino</i>",
                    label: 'Roll',
                    callback: async (html) => {
                        const rollData = simpleSkillData.rollData;
                        rollData.modifiers['difficulty'] = parseInt(html.find('[id=difficulty] :selected').val());
                        rollData.modifiers['modifier'] = html.find('#modifier')[0].value;
                        await rollData.calculateTotalModifiers();
                        await simpleSkillData.calculateSuccessOrFailure();
                        await sendActionDataToChat(simpleSkillData);
                    },
                },
                cancel: {
                    icon: "<i class='dh-material'>close</i>",
                    label: 'Cancel',
                    callback: () => {},
                },
            },
            default: 'roll',
            close: () => {},
        },
        {
            width: 300,
        },
    );
    dialog.render(true);
}
