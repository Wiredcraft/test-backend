const assert = require('assert');
const should = require('should')
const {computeQuestionnaire} = require('../../project-evaluation/compute/core')
const serialize = require('serialize-javascript');

describe('项目评分', function () {

    describe('问卷', function () {
        describe('问卷打分', function () {

            before(done => {

                // 这里可以做一些测试前的数据准备等工作
                done()

            })

            it('操作数验证', function (done) {
                const Q_2021_5_12 = require('../../project-evaluation/questionnaire/2021.5.12')
                Q_2021_5_12.base_conditions.forEach(basecondition => {
                    basecondition.operands.forEach(operand => {
                        operand.value = undefined
                    })
                })
                let ret = computeQuestionnaire(Q_2021_5_12, 'CEC')
                ret.score.should.equal(-1, `当操作数为空时应返回-1, 实际返回为: ${JSON.stringify(ret)}`)

                done()
            })

            describe('评分', function () {
                const Q_2021_5_12 = require('../../project-evaluation/questionnaire/2021.5.12')
                before(done => {
                    Q_2021_5_12.setBaseConditionOperand('language', 'skill_level', 'A')
                    Q_2021_5_12.setBaseConditionOperand('language', 'CLB_score', 7)
                    Q_2021_5_12.setQuestionOperand('spouse_or_cohabiting_partner_peer', 'spouse_or_cohabiting_partner_peer', true)
                    Q_2021_5_12.setQuestionOperand('birthday', 'birthday', '1985-01-01')
                    // 关联操作数无需手动赋值,在问卷评分模块里自动赋值
                    // Q_2021_5_12.setQuestionOperand('birthday', 'spouse_or_cohabiting_partner_peer', true)
                    Q_2021_5_12.setQuestionOperand('marriage', 'marriage', '已婚')
                    Q_2021_5_12.setQuestionOperand('spouse_identity_PR_or_civics_CA', 'spouse_identity_PR_or_civics_CA', true)
                    Q_2021_5_12.setQuestionOperand('kinships_identity_PR_or_civics_CA',
                        'kinships_identity_PR_or_civics_CA',
                        ['亲姐妹', '侄子侄女'])
                    Q_2021_5_12.setQuestionOperand('education_CA',
                        'education_CA',
                        1)
                    Q_2021_5_12.setQuestionOperand('certificate_of_higher_education_CA',
                        'certificate_of_higher_education_CA',
                        2)
                    Q_2021_5_12.setQuestionOperand('spouse_or_cohabiting_language_exam',
                        'spouse_or_cohabiting_language_exam',
                        'IELTS-A')
                    Q_2021_5_12.setQuestionOperand('spouse_or_cohabiting_language_exam_joined',
                        'spouse_or_cohabiting_language_exam_joined',
                        true)
                    Q_2021_5_12.setQuestionOperand('spouse_or_cohabiting_language_exam_date',
                        'spouse_or_cohabiting_language_exam_date',
                        '2020-10-12')
                    Q_2021_5_12.setQuestionOperand('spouse_or_cohabiting_education_CA',
                        'spouse_or_cohabiting_education_CA',
                        1)
                    Q_2021_5_12.setQuestionOperand('language_exam',
                        'language_exam',
                        'TOEFL')
                    Q_2021_5_12.setQuestionOperand('first_lang_s',
                        'first_lang_s',
                        [371, 392])

                    done()

                })

                it('CEC', function (done) {
                    const ret = computeQuestionnaire(Q_2021_5_12, 'CEC')
                    console.info(JSON.stringify(ret))
                    ret.score.should.greaterThan(-1, `当操作数符合条件时分值应当大于-1, 实际返回为: ${JSON.stringify(ret)}`)
                    done()
                });

                it('FSW', function (done) {
                    const ret = computeQuestionnaire(Q_2021_5_12, 'FSW')
                    console.info(JSON.stringify(ret))
                    console.info(JSON.stringify(ret.report_questionnaire.question_groups['FSW'].map(g =>
                        new Object({name: g.name, score:g.score, max_score: g.max_score(), raw_score: g.raw_score,
                        children: g.children && g.children.map(sub_group =>
                            new Object({name: sub_group.name, score:sub_group.score,
                                max_score: sub_group.max_score(), raw_score: sub_group.raw_score}))}))))
                    ret.score.should.greaterThan(-1, `当操作数符合条件时分值应当大于-1, 实际返回为: ${JSON.stringify(ret)}`)
                    done()
                });

                it('FSW-反序列化', function (done) {
                    const serialize_str = serialize(Q_2021_5_12, {unsafe: true})
                    const reserialize = eval(`(${serialize_str})`)

                    const ret = computeQuestionnaire(reserialize, 'FSW')
                    console.info(JSON.stringify(ret))
                    ret.score.should.greaterThan(-1, `当操作数符合条件时分值应当大于-1, 实际返回为: ${JSON.stringify(ret)}`)
                    done()
                });

                it('CRS', function (done) {
                    const ret = computeQuestionnaire(Q_2021_5_12, 'CRS')
                    console.info(JSON.stringify(ret))
                    ret.score.should.greaterThan(-1, `当操作数符合条件时分值应当大于-1, 实际返回为: ${JSON.stringify(ret)}`)
                    done()
                });

            })


            after(done => {
                done()
            })

        })

    })

})