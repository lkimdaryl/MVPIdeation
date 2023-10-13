document.addEventListener("DOMContentLoaded", () => {

const mvpTable = document.querySelector('#mvp-table tbody');

// Fetch section information to get section IDs
fetch('https://slidespace.icu/api/sections')
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  })
  .then(sections => {
  //console.log(sections);
  sections = JSON.parse(sections.sections);
  //console.log(sections);
    // Check if sections is an object and convert it to an array if necessary
    if (typeof sections === 'object' && sections !== null) {
      sections = Object.keys(sections).map(key => ({id: key, name: sections[key]}));
      //console.log(sections);
    }

    // Check if sections is now an array before looping through it
    if (Array.isArray(sections)) {
      sections.forEach(section => {
        //console.log(section.id);
        fetch(`https://slidespace.icu/api/sections/${section.id}/teams`)
          .then(response => {
          //console.log(response);
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .then(teams => {
          //console.log(teams);
          teams = JSON.parse(teams.names);
          //console.log(teams);
            // Check if sections is an object and convert it to an array if necessary
            if (typeof teams === 'object' && teams !== null) {
              //console.log('running');
              teams = Object.keys(teams).map(key => ({id: key, name: teams[key]}));
              //console.log(teams);
            }
            // Loop through teams and fetch team details and scores
            teams.forEach(team => {
              //console.log(team.id);
              const teamDetailsPromise = fetch(`https://slidespace.icu/api/teams/${team.id}`);
              const teamScoresPromise = fetch(`https://slidespace.icu/api/teams/${team.id}/scores`);

              Promise.all([teamDetailsPromise, teamScoresPromise])
                .then(responses => {
                  const teamDetails = responses[0].json();
                  const teamScores = responses[1].json();
                  // Combine team details and scores into one object
                  return Promise.all([teamDetails, teamScores])
                    .then(([details, scores]) => ({...details, ...scores}));
                })
                .then(teamData => {
                  // Add team data to MVP list
//                  console.log(teamData);
                  teamInfo = JSON.parse(teamData.team);
                  teamScores = JSON.parse(teamData.scores);
                  teamMembers = JSON.parse(teamInfo.members);
//                  teamMembers.forEach(team_member => {
//                    console.log(team_member);
//                  });
//                  console.log(teamData);
//    teamInfo------>{team: '{"id":8,
//                            "name":"Tennis Court Analyzer",
//    teamMembers------------>"members":"…hpour\\", \\"Svenja Leonard\\", \\"Yusuf Morsi\\"]\\n"}',
//    teamScores--->scores: '{"topic_1":"50",
//                            "topic_2":"60",
//                            "topic_3":"100"}'}

//                  console.log(teamData.id);
//                  console.log(teamData.name);
//                  console.log(teamData.members);
//                  console.log(teamData.scores);
//                  console.log(teamScores);
//                  console.log(teamMembers);

//                  let membersTableCells = '';
//                  for (const member of teamMembers) {
//                    membersTableCells += `<td>${member}</td>`;
//                  }


                  let mvpEntry = document.createElement('tr');
                  let membersTableCells = teamMembers.map(member => `${member}, `).join('');
                  mvpEntry.innerHTML = `
                    <td style="width: 10%;">${teamScores.topic_1}</td>
                    <td style="width: 10%;">${teamScores.topic_2}</td>
                    <td style="width: 10%;">${teamScores.topic_3}</td>
                    <td style="width: 40%;">${teamInfo.name}</td>
                    <td>${membersTableCells}</td>
                  `;
                  mvpTable.appendChild(mvpEntry);
                })
                .catch(error => console.error('Error:', error));
            });
          })
          .catch(error => console.error('Error:', error));
      });
    } else {
      throw new Error('Sections response is not an array.');
    }
  })
  .catch(error => console.error('Error:', error));

});