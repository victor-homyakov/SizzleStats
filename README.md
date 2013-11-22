SizzleStats
===========

jQuery plugin to collect and show in console performance stats of Sizzle selector.

Sizzle is integrated into jQuery via `$.find()` and is used in all methods where selector string is accepted,
e.g. `.filter(selector)`, `.closest(selector)` etc.

Usage of SizzleStats plugin:

1. During development phase include this script into your page/application somewhere after jQuery

        <script src="jquery.js"></script>
        <script src="jquery.sizzlestats.js"></script>

2. Periodically inspect console of your browser's developer tools for warnings like

        Selector took 16ms: li[data-id=5019227173963858173]

3. For table with full statistics execute in console

        $.SizzleStats()

    Example output in Firefox (without Firebug and its `console.table()`):

        ".board-tooltip-inner                                                                       7536 515"
        ".board-tooltip                                                                             3777 273"
        ".i-role-tooltipArticle                                                                     3777 262"
        ".i-role-card                                                                               938  35"
        ".board-unit                                                                                82   1"
        "[data-id=b64_MjA_2_]                                                                       46   9"
        ".i-role-id                                                                                 38   0"
        "[data-id=b64_MTU_2_]                                                                       32   2"
        "a[href=#]                                                                                  31   0"
        "[data-id=b64_MTg_2_]                                                                       26   4"
        ".label__finish                                                                             19   1"
        ".elems-cell_unit-editable                                                                  19   1"
        ".list-quick-add                                                                            19   3"
        ".i-role-cellholder, .i-role-cell                                                           17   3"
        "body                                                                                       15   0"
        ".board-unit[data-id=tags_long]                                                             12   1"
        ".ui-menu                                                                                   12   0"
        ".user-sub a:contains("Switch to version 3.0.3"), .user-sub a:contains("Try version 3.0.3") 8    111"
        "ul                                                                                         7    0"
        ".board-unit[data-id=general_entity_id]                                                     7    1"
        ".board-unit[data-id=effort_total]                                                          7    0"
        ".board-unit[data-id=state_full_length]                                                     7    0"
        ".board-unit[data-id=assigned_users]                                                        7    0"
        ".board-unit[data-id=team_name_short]                                                       7    0"
        ".board-unit[data-id=owner]                                                                 7    1"
        ".board-unit[data-id=project_abbr]                                                          7    0"
        ".ui-icon                                                                                   6    0"
        ":text                                                                                      5    3"
        ".i-role-grid                                                                               5    0"
        "[role=holder]                                                                              5    0"
        "a.ui-state-active                                                                          5    0"

    - note most used selector ".board-tooltip-inner" on the top: 7536 times and 515 milliseconds
    - note very inefficient selector
      '.user-sub a:contains("Switch to version 3.0.3"), .user-sub a:contains("Try version 3.0.3")': 111ms for 8 invocations

4. `$.SizzleStats.options` contains adjustable threshold values:

        $.SizzleStats.options = {
            MIN_COUNT_TO_SHOW: 5,
            MIN_TIME_TO_SHOW: 10,
            MIN_TIME_TO_WARN: 10
        };

    Selector will be shown in results only when it was used more than `MIN_COUNT_TO_SHOW` times or its summary execution
    time took more than `MIN_TIME_TO_SHOW` milliseconds.

    If a selector was executed longer than `MIN_TIME_TO_WARN` milliseconds then warning will be shown in console.
