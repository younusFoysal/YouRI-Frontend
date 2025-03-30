import React from 'react';
import { format } from 'date-fns';
import { WorkSession, Screenshot, Application, Link } from '../types';
import { Clock, Monitor, Layout, Link as LinkIcon } from 'lucide-react';

interface ActivityMonitorProps {
  workSession: WorkSession;
}

const ActivityMonitor: React.FC<ActivityMonitorProps> = ({ workSession }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Current Session</h2>
          <div className="flex items-center text-gray-600">
            <Clock size={16} className="mr-2"/>
            <span>
              {format(new Date(workSession.startTime), 'HH:mm')} -{' '}
              {format(new Date(workSession.endTime), 'HH:mm')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workSession.screenshots.map((screenshot) => (
              <div key={screenshot._id} className="relative group">
                <img
                    src={screenshot.imageUrl}
                    alt={`Screenshot at ${screenshot.timestamp}`}
                    className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                <span className="text-sm">
                  {format(new Date(screenshot.timestamp), 'HH:mm:ss')}
                </span>
                </div>
              </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Applications Used</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {workSession.applications.map((app) => (
                <div key={app._id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <div className="flex items-center space-x-3">
                    <img src={app.icon} alt={app.name} className="w-8 h-8"/>
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-gray-600">
                        {Math.round(app.timeSpent / 60)} mins
                      </p>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* List View of visited links */}
        {/*<div className="mt-6">*/}
        {/*  <h3 className="text-lg font-semibold mb-4">Visited Links</h3>*/}
        {/*  <div className="space-y-3">*/}
        {/*    {workSession.links.map((link) => (*/}
        {/*      <div key={link._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">*/}
        {/*        <LinkIcon size={16} className="text-gray-600" />*/}
        {/*        <div>*/}
        {/*          <a*/}
        {/*            href={link.url}*/}
        {/*            target="_blank"*/}
        {/*            rel="noopener noreferrer"*/}
        {/*            className="text-blue-600 hover:underline"*/}
        {/*          >*/}
        {/*            {link.title}*/}
        {/*          </a>*/}
        {/*          <p className="text-sm text-gray-600">*/}
        {/*            {format(new Date(link.timestamp), 'HH:mm')}*/}
        {/*          </p>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/* Grid View of visited links */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Visited Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {workSession.links.map((link) => (
                <div
                    key={link._id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  <LinkIcon size={16} className="text-gray-600"/>
                  <div>
                    <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                      {link.title}
                    </a>
                    <p className="text-sm text-gray-600">
                      {format(new Date(link.timestamp), 'HH:mm')}
                    </p>
                  </div>
                </div>
            ))}
          </div>
        </div>

      {/*  Note */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Note</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">{workSession.notes}</p>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ActivityMonitor;