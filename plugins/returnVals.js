// https://www.youtube.com/watch?v=SwSle66O5sU
const OFF = `${~315 >>> 3}@@`

module.exports = {
  // ----------------------------- getting data ------------------

  /**
   * @alias logText
   * @since 0.4.0
   * @return {string} text log
   */
  getText() {
    const text = this.logText()
    return text === OFF ? '' : text
  },
  /**
   * @alias logData
   * @since 0.4.0
   * @return {any}
   */
  getData() {
    const data = this.logData()
    return data === OFF ? undefined : data
  },

  /**
   * @since 0.2.0
   * @tutorial https://github.com/fliphub/fliplog#return
   * @return {ReturnVals}
   */
  returnVals() {
    const text = this.logText()
    const datas = this.logData()

    if (datas !== OFF && text !== OFF) return {text, datas}
    else if (datas !== OFF) return {datas}
    else if (text !== OFF) return {text}
    else return {text, datas}
  },

  /**
   * @tutorial https://github.com/fliphub/fliplog#return
   * @since 0.2.0 (added param 0.3.0)
   * @param {boolean} [textAndDataOnly=false]
   * @return {ReturnVal}
   */
  return(textAndDataOnly = false) {
    if (textAndDataOnly === true) {
      return this.returnVals()
    }

    if (this.has('tags') === true) {
      this._filter()
    }
    const returnVals = this.returnVals()
    const entries = this.entries()
    this.reset()
    return Object.assign(entries, returnVals)
  },
}
