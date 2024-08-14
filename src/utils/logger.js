const fs = require("fs");

class Logger {
    constructor(req, options) {
        const defaultOptions = { success: true, error: true, info: true, validation: true, fileNamePadding: 6, console: ["info", "error","validation"] };
        this.date = new Date();
        this.req = req;
        this.options = { ...defaultOptions, ...options };
        this.msg = ""
    }

    info(message) {
        if (this.options.console.includes("info")) console.log(message);
        if (this.options.info) {
            this.msg += `info: ${message}\n`;
        }
    }

    error(error) {
        if (this.options.console.includes("error")) console.error(error);
        if (this.options.error) {
            this.msg += `error: ${error.stack}\n`;
            this.save("error");
        }
    }

    success(response) {
        if (this.options.console.includes("success")) console.log(response);
        if (this.options.success) {
            this.msg += `response: ${JSON.stringify(response)}\n`;
            this.save("success");
        }
    }

    validationError(error) {
        if (this.options.console.includes("validation")) console.log(error);
        if (this.options.validation) {
            this.msg += `validation: ${error}\n`;
            this.save("success");
        }
    }

    save(type) {
        const head = `${new Date().toLocaleString()}\n${this.req.method.padEnd(6, " ")} => ${this.req.url} - ${new Date().getTime() - this.date.getTime()} ms\nuser: ${JSON.stringify(this.req.user || {})}\nbody: ${JSON.stringify(this.req.body)}\nquery: ${JSON.stringify(this.req.query)}\nparams: ${JSON.stringify(this.req.params)}\n`
        const message = `${head}${this.msg}\n\n\n`;
        if (!fs.existsSync("logs")) fs.mkdirSync('logs');
        let folder = `logs/${new Date().getDate().toString().padStart(2, "0")}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}-${new Date().getFullYear()}`;
        if (!fs.existsSync(folder)) fs.mkdirSync(folder);
        folder = `${folder}/${type}`
        if (!fs.existsSync(folder)) fs.mkdirSync(folder);
        let part = 1;
        const lastFile = fs.readdirSync(folder).pop();
        if (lastFile) {
            part = +lastFile.split("-").pop().split(".")[0];
            const size = fs.statSync(`${folder}/${lastFile}`).size;
            if (size / (1024 * 1024) >= 1) part++;
        };
        type = type + "-" + part.toString().padStart(this.options.fileNamePadding, "0") + ".log";

        fs.appendFileSync(`${folder}/${type}`, message);
    }
}

module.exports = Logger;