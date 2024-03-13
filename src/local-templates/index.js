const fs = window.fs;
const path = window.path;
const usrHomePth = window.usrHomePth();
const localTemplatePath = path.join(usrHomePth, ".excel-handler", "templates");
const localTemplates =
    {
        /**
         * Fetches all the templates from the local file system
         * @returns {Promise<*[]>}
         */
        async fetchTemplates() {
            try {
                await fs.access(localTemplatePath)
            } catch (e) {
                await fs.mkdir(localTemplatePath, {recursive: true});
            }
            const templates = await fs.readdir(localTemplatePath);
            const templateObjs = [];
            for (let template of templates) {
                if (template.endsWith(".json")) {
                    const templateJson = await fs.readFile(path.join(localTemplatePath, template), "utf-8");
                    console.log("templateJson", templateJson);
                    templateObjs.push(JSON.parse(templateJson));
                }
            }
            return templateObjs;
        },
        /**
         * check if a template exists
         * @param templateName
         * @returns {Promise<boolean>}
         */
        async templateExists(templateName) {
            try {
                fs.access(path.join(localTemplatePath, `${templateName}.json`))
                return true;
            } catch (e) {
                return false;
            }
        },
        /**
         * Save a template to the local file system
         * @param template the template to save
         * @returns {Promise<void>} a promise that resolves when the template is saved
         */
        async saveTemplate(template) {
            const templateJson = JSON.stringify(template);
            await fs.writeFile(path.join(localTemplatePath, `${template.name}.json`), templateJson);
        },

        async deleteTemplate(name) {
            const exists = await this.templateExists(name);
            if (exists) {
                await fs.unlink(path.join(localTemplatePath, `${name}.json`));
            }
        }
    }
export default localTemplates;