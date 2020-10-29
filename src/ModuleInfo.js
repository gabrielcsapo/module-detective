import React from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

export default function ModuleInfo() {
  const { id } = useParams();
  const name = decodeURIComponent(id);

  const { dependencies, suggestions } = report;

  const versions = {};
  const locations = {};

  for (const [, dependencyInfo] of dependencies) {
    if (dependencyInfo.name === name) {
      const breadcrumb = dependencyInfo.breadcrumb;
      const version = dependencyInfo?.packageInfo?.version;

      if (version) {
        if (!versions[version]) {
          versions[version] = 0;
        }
        versions[version] += 1;
      }

      if (!locations[breadcrumb]) {
        locations[breadcrumb] = {
          version,
          actions: [],
        };
      }
    }
  }

  suggestions.forEach((suggestion) => {
    suggestion.actions.forEach((action) => {
      const parts = action.meta.breadcrumb.split("#");

      // we want to split the breadcrumb (foo#bar#@moo/bar)
      // if the last value is the name of the current module we are looking at
      // pick this and update the location object with the suggestion.
      if (parts.length > 0 && parts[parts.length - 1] === name) {
        locations[action.meta.breadcrumb].actions.push(action);
      }
    });
  });

  return (
    <div>
      <h3>{name}</h3>
      <div>
        {Object.keys(versions).map((version) => (
          <span key={version}>
            {version} ({versions[version]})
          </span>
        ))}
      </div>
      <br />
      {Object.keys(locations)
        .sort()
        .map((locationPath, i) => {
          return (
            <Accordion key={i}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Breadcrumbs aria-label="breadcrumb" key={i}>
                  {locationPath.split("#").map((segment, j, arr) => {
                    if (j === arr.length - 1) {
                      return (
                        <Typography key={j}>
                          {segment}@{locations[locationPath].version}
                        </Typography>
                      );
                    }
                    return <Typography key={j}>{segment}</Typography>;
                  })}
                  {locations[locationPath] && (
                    <Avatar>{locations[locationPath]?.actions.length}</Avatar>
                  )}
                </Breadcrumbs>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {locations[locationPath] &&
                    locations[locationPath].actions &&
                    locations[locationPath].actions.map((suggestion, k) => {
                      return (
                        <ListItem divider={true} key={k}>
                          <ListItemText primary={suggestion.message} />
                        </ListItem>
                      );
                    })}
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })}
    </div>
  );
}
